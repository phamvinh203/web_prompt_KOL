import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { unlinkSync, rmSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { splitVideoIntoSegments } from '../services/videoSplitter.js';
import { generateVideoSegmentPrompt } from '../services/gemini.js';
import { VideoHistory } from '../db/models.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files allowed'));
  },
});

router.post('/', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Video file is required' });

  const segmentDuration = Math.max(1, parseInt(req.body.segment_duration) || 3);
  const sessionDir = path.join(__dirname, '../uploads/', uuidv4());

  try {
    const segments = await splitVideoIntoSegments(req.file.path, segmentDuration, sessionDir);

    const prompts = await Promise.all(
      segments.map(seg => generateVideoSegmentPrompt(seg.framePath, seg.index, seg.start, seg.end))
    );

    const segmentDocs = segments.map((seg, i) => ({
      segment_index: seg.index,
      start_time: seg.start,
      end_time: seg.end,
      motion_prompt: prompts[i],
    }));

    await VideoHistory.create({
      video_filename: req.file.originalname,
      segment_duration: segmentDuration,
      segments: segmentDocs,
    });

    res.json({ segments: segmentDocs.map(s => ({
      index: s.segment_index,
      start: s.start_time,
      end: s.end_time,
      motion_prompt: s.motion_prompt,
    })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    try { unlinkSync(req.file.path); } catch {}
    try { rmSync(sessionDir, { recursive: true, force: true }); } catch {}
  }
});

export default router;
