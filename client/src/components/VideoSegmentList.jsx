import { useRef, useState, useEffect } from 'react';

function SegmentRow({ seg, index: i, videoUrl }) {
  const [copiedLang, setCopiedLang] = useState(null);
  const videoRef = useRef(null);

  // motion_prompt có thể là {en, vi} hoặc string (backward compat)
  const prompt = typeof seg.motion_prompt === 'object' && seg.motion_prompt !== null
    ? seg.motion_prompt
    : { en: seg.motion_prompt ?? '', vi: seg.motion_prompt ?? '' };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !videoUrl) return;
    const setTime = () => { vid.currentTime = seg.start; };
    if (vid.readyState >= 1) setTime();
    else vid.addEventListener('loadedmetadata', setTime, { once: true });
  }, [videoUrl, seg.start]);

  async function copy(lang) {
    await navigator.clipboard.writeText(prompt[lang]);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden slide-up"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <span
          className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(232,168,71,0.12)', color: 'rgba(232,168,71,0.9)' }}
        >{seg.index}</span>
        <span className="text-xs font-mono-prompt" style={{ color: 'var(--text-3)' }}>
          {seg.start}s — {seg.end}s
        </span>
      </div>

      {/* Video preview */}
      {videoUrl && (
        <div style={{ background: '#000', borderBottom: '1px solid var(--border)' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            preload="metadata"
            style={{ width: '100%', maxHeight: '180px', display: 'block' }}
          />
        </div>
      )}

      {/* EN prompt */}
      <div className="px-4 pt-3 pb-2" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--accent)', fontSize: 10 }}>EN</span>
          <button
            onClick={() => copy('en')}
            className="text-xs px-2 py-0.5 rounded-lg transition-all"
            style={copiedLang === 'en'
              ? { background: 'rgba(124,106,245,0.15)', color: 'var(--accent)', border: '1px solid rgba(124,106,245,0.3)' }
              : { background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }
            }
          >{copiedLang === 'en' ? '✓' : 'Copy'}</button>
        </div>
        <p className="text-xs font-mono-prompt leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: '1.7' }}>
          {prompt.en || '—'}
        </p>
      </div>

      {/* VI prompt */}
      <div className="px-4 pt-2.5 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--amber)', fontSize: 10 }}>VI</span>
          <button
            onClick={() => copy('vi')}
            className="text-xs px-2 py-0.5 rounded-lg transition-all"
            style={copiedLang === 'vi'
              ? { background: 'rgba(232,164,74,0.15)', color: 'var(--amber)', border: '1px solid rgba(232,164,74,0.3)' }
              : { background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }
            }
          >{copiedLang === 'vi' ? '✓' : 'Copy'}</button>
        </div>
        <p className="text-xs font-mono-prompt leading-relaxed" style={{ color: 'var(--text-1)', lineHeight: '1.7' }}>
          {prompt.vi || '—'}
        </p>
      </div>
    </div>
  );
}

export default function VideoSegmentList({ segments, videoUrl }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{segments.length} đoạn</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
      {segments.map((seg, i) => <SegmentRow key={seg.index} seg={seg} index={i} videoUrl={videoUrl} />)}
    </div>
  );
}
