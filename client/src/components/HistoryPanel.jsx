import { useEffect, useState } from 'react';
import api from '../utils/api.js';

/* ─── Image history item ─────────────────────────────────────────── */
function ImageHistoryItem({ item, onDelete }) {
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
          >✕</button>
          <span className="text-xs" style={{ color: 'var(--text-3)', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 150ms' }}>▼</span>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { key: 'pose_prompt',         color: 'var(--amber)', label: 'POSE' },
            { key: 'motion_prompt',       color: 'var(--rose)',  label: 'MOTION' },
            { key: 'continuation_prompt', color: 'var(--teal)',  label: 'CONT.' },
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

/* ─── Video history item ─────────────────────────────────────────── */
function VideoHistoryItem({ item, onDelete }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);

  async function copyPrompt(text, idx) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="rounded-2xl overflow-hidden transition-colors" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm"
          style={{ background: 'rgba(232,168,71,0.08)', border: '1px solid rgba(232,168,71,0.18)' }}
        >🎬</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-2)' }}>
            {item.video_filename}
          </p>
          <p className="text-xs mt-0.5 font-mono-prompt" style={{ color: 'var(--text-3)' }}>
            {item.segments?.length ?? 0} đoạn · {item.segment_duration}s/đoạn · {new Date(item.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
            className="text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-3)', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >✕</button>
          <span className="text-xs" style={{ color: 'var(--text-3)', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 150ms' }}>▼</span>
        </div>
      </div>

      {open && (
        <div className="slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          {(item.segments ?? []).map((seg) => {
            const idx   = seg.segment_index ?? seg.index;
            const start = seg.start_time    ?? seg.start;
            const mp    = seg.motion_prompt;
            const prompt = typeof mp === 'object' && mp !== null ? mp : { en: mp ?? '', vi: mp ?? '' };
            return (
            <div key={idx} style={{ borderBottom: '1px solid var(--border-soft)' }}>
              {/* Segment header */}
              <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <span
                  className="text-xs font-bold w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(232,168,71,0.12)', color: 'rgba(232,168,71,0.9)', fontSize: 10 }}
                >{idx}</span>
                <span className="text-xs font-mono-prompt" style={{ color: 'var(--text-3)' }}>{start}s</span>
              </div>
              {/* EN */}
              <div className="flex gap-3 px-4 py-2" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--accent)', fontSize: 9, letterSpacing: '0.05em' }}>EN</span>
                <p className="flex-1 text-xs font-mono-prompt leading-relaxed" style={{ color: 'var(--text-3)', lineHeight: '1.6' }}>{prompt.en || '—'}</p>
                <button
                  onClick={() => copyPrompt(prompt.en, `${idx}-en`)}
                  className="shrink-0 text-xs px-1.5 py-0.5 rounded-lg self-start transition-all"
                  style={copied === `${idx}-en`
                    ? { background: 'rgba(124,106,245,0.15)', color: 'var(--accent)', border: '1px solid rgba(124,106,245,0.3)' }
                    : { background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }
                  }
                >{copied === `${idx}-en` ? '✓' : 'Copy'}</button>
              </div>
              {/* VI */}
              <div className="flex gap-3 px-4 py-2">
                <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--amber)', fontSize: 9, letterSpacing: '0.05em' }}>VI</span>
                <p className="flex-1 text-xs font-mono-prompt leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: '1.6' }}>{prompt.vi || '—'}</p>
                <button
                  onClick={() => copyPrompt(prompt.vi, `${idx}-vi`)}
                  className="shrink-0 text-xs px-1.5 py-0.5 rounded-lg self-start transition-all"
                  style={copied === `${idx}-vi`
                    ? { background: 'rgba(232,164,74,0.15)', color: 'var(--amber)', border: '1px solid rgba(232,164,74,0.3)' }
                    : { background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }
                  }
                >{copied === `${idx}-vi` ? '✓' : 'Copy'}</button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Panel ──────────────────────────────────────────────────────── */
export default function HistoryPanel({ activeTab }) {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadedTabs, setLoadedTabs] = useState(new Set());

  useEffect(() => {
    if (loadedTabs.has(activeTab)) return;

    if (activeTab === 'image') {
      api.get('/history/images')
        .then(r => setImages(Array.isArray(r.data) ? r.data : []))
        .catch(() => {});
    } else {
      api.get('/history/videos')
        .then(r => setVideos(Array.isArray(r.data) ? r.data : []))
        .catch(() => {});
    }
    setLoadedTabs(prev => new Set([...prev, activeTab]));
  }, [activeTab]);

  async function deleteImage(id) {
    await api.delete(`/history/images/${id}`);
    setImages(prev => prev.filter(i => i._id !== id));
  }

  async function deleteVideo(id) {
    await api.delete(`/history/videos/${id}`);
    setVideos(prev => prev.filter(v => v._id !== id));
  }

  const isImage = activeTab === 'image';
  const items = isImage ? images : videos;
  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
          {isImage ? 'Lịch sử ảnh' : 'Lịch sử video'} ({items.length})
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {isImage
          ? images.map(item => <ImageHistoryItem key={item._id} item={item} onDelete={deleteImage} />)
          : videos.map(item => <VideoHistoryItem key={item._id} item={item} onDelete={deleteVideo} />)
        }
      </div>
    </div>
  );
}
