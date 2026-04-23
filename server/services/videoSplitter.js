import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { mkdirSync } from 'fs';

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
      // quality 2 = high quality JPEG (scale 1-31, lower = better)
      // strip metadata to reduce file size (media-processing best practice)
      .outputOptions(['-q:v 2', '-map_metadata -1'])
      .output(outputPath)
      .on('end', resolve)
      .on('error', (err) => reject(new Error(`Frame extraction failed at ${timeSeconds}s: ${err.message}`)))
      .run();
  });
}

export async function splitVideoIntoSegments(videoPath, segmentDuration = 3, outputDir) {
  mkdirSync(outputDir, { recursive: true });

  const duration = await getVideoDuration(videoPath);
  const segments = [];

  let index = 1;
  for (let start = 0; start < duration; start += segmentDuration) {
    const end = Math.min(start + segmentDuration, duration);
    const midPoint = start + (end - start) / 2;

    const framePath = path.join(outputDir, `segment_${index}_frame.jpg`);

    try {
      await extractFrame(videoPath, framePath, midPoint);
    } catch (err) {
      console.warn(`Skipping segment ${index}: ${err.message}`);
      index++;
      continue;
    }

    segments.push({
      index,
      start: parseFloat(start.toFixed(2)),
      end: parseFloat(end.toFixed(2)),
      framePath,
    });
    index++;
  }

  if (segments.length === 0) throw new Error('No segments could be extracted from the video');
  return segments;
}
