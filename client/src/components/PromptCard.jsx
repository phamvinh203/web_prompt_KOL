import { useState } from 'react';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  async function handle() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handle}
      className="text-xs px-2.5 py-1 rounded-lg transition-all duration-150"
      style={copied
        ? { background: 'rgba(78,205,196,0.15)', color: 'var(--cyan)', border: '1px solid rgba(78,205,196,0.3)' }
        : { background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }
      }
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

const ACCENT = {
  pose:         { dot: '#e8a847', label: 'POSE' },
  motion:       { dot: '#f06a7e', label: 'MOTION' },
  continuation: { dot: '#4ecdc4', label: 'CONTINUATION' },
};

export default function PromptCard({ type = 'pose', promptData }) {
  const { en = '', vi = '' } = typeof promptData === 'string'
    ? { en: promptData, vi: promptData }
    : (promptData || {});

  const accent = ACCENT[type] || ACCENT.pose;

  return (
    <div className="rounded-2xl overflow-hidden slide-up" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full" style={{ background: accent.dot, boxShadow: `0 0 6px ${accent.dot}` }} />
          <span className="text-xs font-bold tracking-widest" style={{ color: accent.dot }}>{accent.label}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>Copy:</span>
          <CopyBtn text={en} />
          <CopyBtn text={vi} />
        </div>
      </div>

      {/* Bilingual content */}
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--border)' }}>
        {/* English */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-3)' }}>EN</span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>English prompt</span>
          </div>
          <p className="text-xs leading-relaxed font-mono-prompt" style={{ color: 'var(--text-1)', lineHeight: '1.7' }}>{en}</p>
        </div>

        {/* Vietnamese */}
        <div className="p-4 space-y-2" style={{ borderLeft: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(232,168,71,0.08)', color: 'var(--gold-dim)' }}>VI</span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>Tiếng Việt</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)', lineHeight: '1.7' }}>{vi}</p>
        </div>
      </div>
    </div>
  );
}
