import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync, rmSync, statSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { splitVideoIntoSegments } from '../services/videoSplitter.js';
import { generateVideoSegmentPrompt } from '../services/gemini.js';
import { VideoHistory } from '../db/models.js';
import { logInfo, logOk, logErr, logWarn, logStep, elapsed } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCOPE = 'VIDEO';
const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files allowed'));
  },
});

function send(res, type, data) {
  res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
}

function fileSizeMB(filePath) {
  try { return (statSync(filePath).size / 1024 / 1024).toFixed(1) + ' MB'; }
  catch { return '? MB'; }
}

router.post('/', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Video file is required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const segmentDuration = Math.max(1, parseInt(req.body.segment_duration) || 3);
  const sessionDir = path.join(__dirname, '../uploads/', uuidv4());
  const t0 = Date.now();

  console.log('');
  logInfo(SCOPE, '─'.repeat(52));
  logInfo(SCOPE, `New request: "${req.file.originalname}" (${fileSizeMB(req.file.path)})`);
  logInfo(SCOPE, `Segment duration: ${segmentDuration}s | Session: ${path.basename(sessionDir)}`);

  try {
    // ── Step 1: Split ──────────────────────────────────────
    logInfo(SCOPE, 'Step 1/3 — Splitting video into segments...');
    send(res, 'progress', { step: 'splitting' });
    const tSplit = Date.now();

    const segments = await splitVideoIntoSegments(req.file.path, segmentDuration, sessionDir);
    const total = segments.length;

    logOk(SCOPE, `Step 1/3 done — ${total} segments ready (${elapsed(tSplit)})`);

    // ── Step 2: Analyze each segment ──────────────────────
    logInfo(SCOPE, `Step 2/3 — Analyzing ${total} segments with Gemini...`);
    send(res, 'progress', { step: 'analyzing', current: 0, total });
    const tAnalyze = Date.now();

    const segmentDocs = [];
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      logStep(SCOPE, i + 1, total, `Segment ${seg.index}: ${seg.start}s – ${seg.end}s`);

      try {
        const prompt = await generateVideoSegmentPrompt(seg.framePath, seg.index, seg.start, seg.end);
        segmentDocs.push({ index: seg.index, start: seg.start, end: seg.end, motion_prompt: prompt });
      } catch (segErr) {
        logWarn(SCOPE, `Segment ${seg.index} skipped — ${segErr.message}`);
        segmentDocs.push({ index: seg.index, start: seg.start, end: seg.end, motion_prompt: '[Không thể phân tích đoạn này]' });
      }

      send(res, 'progress', { step: 'analyzing', current: i + 1, total });
    }

    const failed = segmentDocs.filter(s => s.motion_prompt === '[Không thể phân tích đoạn này]').length;
    logOk(SCOPE, `Step 2/3 done — ${total - failed}/${total} prompts generated${failed ? `, ${failed} skipped` : ''} (${elapsed(tAnalyze)})`);

    // ── Step 3: Save to MongoDB ────────────────────────────
    logInfo(SCOPE, 'Step 3/3 — Saving to MongoDB...');
    const tSave = Date.now();

    await VideoHistory.create({
      video_filename: req.file.originalname,
      segment_duration: segmentDuration,
      segments: segmentDocs.map(s => ({
        segment_index: s.index,
        start_time:    s.start,
        end_time:      s.end,
        motion_prompt: s.motion_prompt,
      })),
    });

    logOk(SCOPE, `Step 3/3 done — Saved to MongoDB (${elapsed(tSave)})`);

    // ── Complete ───────────────────────────────────────────
    logOk(SCOPE, `✅ Pipeline complete: ${total} segments in ${elapsed(t0)}`);
    logInfo(SCOPE, '─'.repeat(52));
    console.log('');

    send(res, 'done', { segments: segmentDocs });
    res.end();
  } catch (err) {
    logErr(SCOPE, `Pipeline failed after ${elapsed(t0)} — ${err.message}`);
    logInfo(SCOPE, '─'.repeat(52));
    console.log('');
    send(res, 'error', { error: err.message });
    res.end();
  } finally {
    try { unlinkSync(req.file.path); } catch {}
    try { rmSync(sessionDir, { recursive: true, force: true }); } catch {}
    logInfo(SCOPE, 'Temp files cleaned up');
  }
});

export default router;
