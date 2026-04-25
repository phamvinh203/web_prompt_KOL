import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { mkdirSync } from 'fs';
import { logInfo, logOk, logWarn, logErr, elapsed } from '../utils/logger.js';

const SCOPE = 'SPLIT';

function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(new Error(`Cannot read video: ${err.message}`));
      const duration = metadata.format.duration;
      if (!duration || duration <= 0) return reject(new Error('Video duration is invalid or zero'));
      resolve(duration);
    });
  });
}

function extractFrame(videoPath, outputPath, timeSeconds) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .seekInput(timeSeconds)
      .frames(1)
      .outputOptions(['-q:v 2', '-map_metadata -1'])
      .output(outputPath)
      .on('end', resolve)
      .on('error', (err) => reject(new Error(`Frame extraction failed at ${timeSeconds}s: ${err.message}`)))
      .run();
  });
}

export async function splitVideoIntoSegments(videoPath, segmentDuration = 3, outputDir) {
  mkdirSync(outputDir, { recursive: true });

  logInfo(SCOPE, `Reading video metadata: ${path.basename(videoPath)}`);
  const t0 = Date.now();

  const duration = await getVideoDuration(videoPath);
  const totalSegments = Math.ceil(duration / segmentDuration);

  logOk(SCOPE, `Duration: ${duration.toFixed(2)}s → ${totalSegments} segments × ${segmentDuration}s each`);
  logInfo(SCOPE, `Output dir: ${outputDir}`);

  const segments = [];
  let index = 1;

  for (let start = 0; start < duration; start += segmentDuration) {
    const end      = Math.min(start + segmentDuration, duration);
    const midPoint = start + (end - start) / 2;
    const framePath = path.join(outputDir, `segment_${index}_frame.jpg`);

    const tFrame = Date.now();
    logInfo(SCOPE, `[${index}/${totalSegments}] Extracting frame at ${midPoint.toFixed(2)}s (${start.toFixed(2)}s–${end.toFixed(2)}s)`);

    try {
      await extractFrame(videoPath, framePath, midPoint);
      logOk(SCOPE, `[${index}/${totalSegments}] Frame saved → ${path.basename(framePath)} (${elapsed(tFrame)})`);
      segments.push({
        index,
        start: parseFloat(start.toFixed(2)),
        end:   parseFloat(end.toFixed(2)),
        framePath,
      });
    } catch (err) {
      logWarn(SCOPE, `[${index}/${totalSegments}] Skipped — ${err.message}`);
    }

    index++;
  }

  if (segments.length === 0) {
    logErr(SCOPE, 'No segments could be extracted from the video');
    throw new Error('No segments could be extracted from the video');
  }

  logOk(SCOPE, `Split complete: ${segments.length}/${totalSegments} segments extracted (${elapsed(t0)})`);
  return segments;
}
