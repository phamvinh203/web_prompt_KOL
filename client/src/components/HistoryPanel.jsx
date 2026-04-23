import { useEffect, useState } from 'react';
import api from '../utils/api.js';

function HistoryItem({ item, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden transition-colors" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-2)' }}>
            {item.kol_filename} × {item.product_filename}
          </p>
          <p className="text-xs mt-0.5 font-mono-prompt" style={{ color: 'var(--text-3)' }}>
            {new Date(item.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
            className="text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-3)', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            ✕
          </button>
          <span className="text-xs" style={{ color: 'var(--text-3)', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 150ms' }}>▼</span>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { key: 'pose_prompt', color: 'var(--gold)', label: 'POSE' },
            { key: 'motion_prompt', color: 'var(--rose)', label: 'MOTION' },
            { key: 'continuation_prompt', color: 'var(--cyan)', label: 'CONT.' },
          ].map(({ key, color, label }) => {
            const data = item[key];
            const text = typeof data === 'object' ? data?.en || '' : data || '';
            return (
              <div key={key} className="pt-3">
                <span className="text-xs font-bold" style={{ color }}>{label}</span>
                <p className="text-xs mt-1 font-mono-prompt leading-relaxed" style={{ color: 'var(--text-3)', lineHeight: '1.6' }}>{text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HistoryPanel() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    api.get('/history/images').then(r => setImages(r.data)).catch(() => {});
  }, []);

  async function deleteImage(id) {
    await api.delete(`/history/images/${id}`);
    setImages(prev => prev.filter(i => i._id !== id));
  }

  if (images.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Lịch sử ({images.length})</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {images.map(item => <HistoryItem key={item._id} item={item} onDelete={deleteImage} />)}
      </div>
    </div>
  );
}
