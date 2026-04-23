import { useState, useRef } from 'react';
import api from '../utils/api.js';

// Progress stages: [pct, label]
const STAGES = [
  [8,  'Đang tải ảnh lên server...'],
  [22, 'Gemini đang đọc ảnh KOL...'],
  [45, 'Phân tích phong cách & sản phẩm...'],
  [68, 'Đang tạo prompt tiếng Anh...'],
  [84, 'Đang dịch sang tiếng Việt...'],
  [95, 'Hoàn thiện & kiểm tra JSON...'],
];

export function useImagePrompt() {
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [progress, setProgress] = useState(0);   // 0-100
  const [stepLabel, setStepLabel] = useState('');
  const timerRef = useRef(null);

  function clearTimers() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function runStages() {
    let delay = 0;
    STAGES.forEach(([pct, label], i) => {
      delay += i === 0 ? 300 : 2200 + Math.random() * 800;
      timerRef.current = setTimeout(() => {
        setProgress(pct);
        setStepLabel(label);
      }, delay);
    });
  }

  async function generate(kolFile, productFile, styleOptions = {}) {
    clearTimers();
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setStepLabel('');

    runStages();

    try {
      const form = new FormData();
      form.append('kol_image',     kolFile);
      form.append('product_image', productFile);
      form.append('kol_style',     styleOptions.kol_style || 'auto');
      form.append('mood',          styleOptions.mood      || 'auto');
      form.append('setting',       styleOptions.setting   || 'auto');
      form.append('scenario',      styleOptions.scenario  || 'auto');

      const { data } = await api.post('/image-prompt', form);

      clearTimers();
      setProgress(100);
      setStepLabel('Hoàn thành!');
      setResult(data);
    } catch (err) {
      clearTimers();
      setProgress(0);
      setStepLabel('');
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, progress, stepLabel, generate };
}
