import { useState } from 'react';
import api from '../utils/api.js';

export function useVideoPrompt() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyze(videoFile, segmentDuration = 3) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('video', videoFile);
      form.append('segment_duration', segmentDuration);
      const { data } = await api.post('/video-prompt', form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, analyze };
}
