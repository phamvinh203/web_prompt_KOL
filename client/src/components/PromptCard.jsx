import { useState } from 'react';

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  async function handle() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handle} style={{
      fontSize: 11, padding: '3px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 500,
      background: copied ? 'var(--teal-dim)' : 'var(--bg-surface)',
      color: copied ? 'var(--teal)' : 'var(--text-3)',
      border: `1px solid ${copied ? 'rgba(62,207,190,0.25)' : 'var(--border)'}`,
      transition: 'all 150ms',
    }}>
      {copied ? '✓ Đã sao chép' : label}
    </button>
  );
}

const TYPE_META = {
  pose:         { label: 'PROMPT TƯ THẾ',       dot: 'var(--accent)', tint: 'var(--pose-tint)' },
  motion:       { label: 'PROMPT CHUYỂN ĐỘNG',  dot: 'var(--amber)',  tint: 'var(--motion-tint)' },
  continuation: { label: 'PROMPT TIẾP NỐI',     dot: 'var(--teal)',   tint: 'var(--cont-tint)' },
};

export default function PromptCard({ type = 'pose', promptData }) {
  const { en = '', vi = '' } = typeof promptData === 'string'
    ? { en: promptData, vi: promptData }
    : (promptData || {});

  const meta = TYPE_META[type] || TYPE_META.pose;

  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: meta.tint,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.dot, display: 'inline-block', boxShadow: `0 0 8px ${meta.dot}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: meta.dot }}>{meta.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', marginRight: 2 }}>Sao chép:</span>
          <CopyBtn text={en} label="Tiếng Anh" />
          <CopyBtn text={vi} label="Tiếng Việt" />
        </div>
      </div>

      {/* Body — 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* English */}
        <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)' }}>EN</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Tiếng Anh — dùng cho GROK</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.75, color: 'var(--text-1)', fontFamily: 'IBM Plex Mono, monospace', margin: 0 }}>{en}</p>
        </div>

        {/* Vietnamese */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 5, background: 'var(--amber-dim)', color: 'var(--amber)' }}>VI</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Tiếng Việt — để tham khảo</span>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.75, color: 'var(--text-2)', margin: 0 }}>{vi}</p>
        </div>
      </div>
    </div>
  );
}
