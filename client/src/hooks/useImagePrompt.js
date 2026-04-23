import { useState } from 'react';
import api from '../utils/api.js';

export function useImagePrompt() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate(kolFile, productFile) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('kol_image', kolFile);
      form.append('product_image', productFile);
      const { data } = await api.post('/image-prompt', form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, generate };
}
