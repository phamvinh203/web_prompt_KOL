import { useState } from 'react';

const IDLE = { step: 'idle', current: 0, total: 0 };

export function useVideoPrompt() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(IDLE);

  async function analyze(videoFile, segmentDuration = 3) {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress({ step: 'uploading', current: 0, total: 0 });

    try {
      const form = new FormData();
      form.append('video', videoFile);
      form.append('segment_duration', segmentDuration);

      const response = await fetch('/api/video-prompt', { method: 'POST', body: form });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Lỗi server: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        // SSE events are separated by double newline
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop();

        for (const chunk of chunks) {
          if (!chunk.trim()) continue;
          let type = '';
          let data = '';
          for (const line of chunk.split('\n')) {
            if (line.startsWith('event:')) type = line.slice(6).trim();
            if (line.startsWith('data:')) data = line.slice(5).trim();
          }
          if (!type || !data) continue;

          const parsed = JSON.parse(data);
          if (type === 'progress') {
            setProgress({ step: parsed.step, current: parsed.current ?? 0, total: parsed.total ?? 0 });
          } else if (type === 'done') {
            setResult(parsed);
          } else if (type === 'error') {
            throw new Error(parsed.error);
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(IDLE);
    }
  }

  return { result, loading, error, progress, analyze };
}
