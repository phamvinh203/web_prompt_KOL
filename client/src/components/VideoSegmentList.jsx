import { useState } from 'react';

function SegmentRow({ seg, index: i }) {
  const [copied, setCopied] = useState(false);
  async function handle() {
    await navigator.clipboard.writeText(seg.motion_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden slide-up"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(232,168,71,0.12)', color: 'var(--gold)' }}>
            {seg.index}
          </span>
          <span className="text-xs font-mono-prompt" style={{ color: 'var(--text-3)' }}>
            {seg.start}s — {seg.end}s
          </span>
        </div>
        <button
          onClick={handle}
          className="text-xs px-2.5 py-1 rounded-lg transition-all"
          style={copied
            ? { background: 'rgba(78,205,196,0.15)', color: 'var(--cyan)', border: '1px solid rgba(78,205,196,0.3)' }
            : { background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }
          }
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="px-4 py-3 text-xs font-mono-prompt leading-relaxed" style={{ color: 'var(--text-1)', lineHeight: '1.7' }}>
        {seg.motion_prompt}
      </p>
    </div>
  );
}

export default function VideoSegmentList({ segments }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{segments.length} đoạn</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
      {segments.map((seg, i) => <SegmentRow key={seg.index} seg={seg} index={i} />)}
    </div>
  );
}
