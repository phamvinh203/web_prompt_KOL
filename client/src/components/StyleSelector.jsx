import { useState } from 'react';

const KOL_STYLES = [
  { id: 'auto',      icon: '✦', label: 'AI Tự chọn',    sub: 'Gemini phân tích' },
  { id: 'luxury',    icon: '💎', label: 'Luxury',        sub: 'Haute couture' },
  { id: 'street',    icon: '🏙', label: 'Street',        sub: 'Urban, Raw' },
  { id: 'kbeauty',   icon: '🌸', label: 'K-Beauty',      sub: 'Soft, Natural' },
  { id: 'editorial', icon: '📸', label: 'Editorial',     sub: 'Magazine' },
  { id: 'sporty',    icon: '⚡', label: 'Sporty',        sub: 'Dynamic' },
  { id: 'vintage',   icon: '🎞', label: 'Vintage',       sub: 'Film grain' },
];

const MOODS = [
  { id: 'auto',       icon: '✦', label: 'AI Tự chọn',   sub: 'Gemini phân tích' },
  { id: 'cinematic',  icon: '🎬', label: 'Cinematic',    sub: 'Anamorphic' },
  { id: 'dreamy',     icon: '☁️', label: 'Dreamy',       sub: 'Soft bokeh' },
  { id: 'vibrant',    icon: '🌈', label: 'Vibrant',      sub: 'High energy' },
  { id: 'minimal',    icon: '◻',  label: 'Minimal',      sub: 'Clean & stark' },
  { id: 'moody',      icon: '🌑', label: 'Moody',        sub: 'Dark & rich' },
];

const SETTINGS = [
  { id: 'auto',        icon: '✦', label: 'AI Tự chọn',  sub: 'Gemini phân tích' },
  { id: 'studio',      icon: '🏳', label: 'Studio',      sub: 'White seamless' },
  { id: 'golden_hour', icon: '🌅', label: 'Golden Hour', sub: 'Sunset warm' },
  { id: 'urban',       icon: '🌆', label: 'Urban',       sub: 'City street' },
  { id: 'nature',      icon: '🌿', label: 'Nature',      sub: 'Greenery' },
  { id: 'night_neon',  icon: '🌃', label: 'Night Neon',  sub: 'Neon glow' },
];

function OptionRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 10 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map(opt => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`option-btn${active ? ' active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', textAlign: 'left', width: '100%' }}
            >
              <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{opt.label}</div>
                <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.3 }}>{opt.sub}</div>
              </div>
              {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StyleSelector({ value, onChange }) {
  const hasCustom = value.kol_style !== 'auto' || value.mood !== 'auto' || value.setting !== 'auto';

  function reset() { onChange({ kol_style: 'auto', mood: 'auto', setting: 'auto' }); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Style & Phong cách</span>
        {hasCustom && (
          <button onClick={reset} style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'underline' }}>Reset</button>
        )}
      </div>

      <OptionRow label="KOL Style"   options={KOL_STYLES} value={value.kol_style} onChange={v => onChange({ ...value, kol_style: v })} />
      <OptionRow label="Visual Mood" options={MOODS}      value={value.mood}      onChange={v => onChange({ ...value, mood: v })} />
      <OptionRow label="Bối cảnh"    options={SETTINGS}   value={value.setting}   onChange={v => onChange({ ...value, setting: v })} />
    </div>
  );
}
