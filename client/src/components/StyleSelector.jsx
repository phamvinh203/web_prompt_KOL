import { useState } from 'react';

const KOL_STYLES = [
  { id: 'auto',      label: '✦ AI Tự chọn',       sub: 'Phân tích & quyết định' },
  { id: 'luxury',    label: 'Luxury Fashion',       sub: 'Haute couture, Editorial' },
  { id: 'street',    label: 'Street Style',         sub: 'Urban, Raw, Authentic' },
  { id: 'kbeauty',   label: 'K-Beauty',             sub: 'Dewy, Soft, Natural' },
  { id: 'editorial', label: 'Editorial',            sub: 'Artistic, Bold, Magazine' },
  { id: 'sporty',    label: 'Sporty & Active',      sub: 'Dynamic, Athletic' },
  { id: 'vintage',   label: 'Vintage Retro',        sub: 'Film grain, 70s–90s' },
];

const MOODS = [
  { id: 'auto',      label: '✦ AI Tự chọn',         sub: 'Phân tích & quyết định' },
  { id: 'cinematic', label: 'Cinematic',             sub: 'Anamorphic, Deep shadows' },
  { id: 'dreamy',    label: 'Soft & Dreamy',         sub: 'Bokeh, Ethereal, Glow' },
  { id: 'vibrant',   label: 'Vibrant',               sub: 'High energy, Bold colors' },
  { id: 'minimal',   label: 'Clean Minimal',         sub: 'White space, Stark light' },
  { id: 'moody',     label: 'Dark & Moody',          sub: 'Low-key, Rich darks' },
];

const SETTINGS = [
  { id: 'auto',         label: '✦ AI Tự chọn',       sub: 'Phân tích & quyết định' },
  { id: 'studio',       label: 'Studio White',        sub: 'Seamless, Controlled' },
  { id: 'golden_hour',  label: 'Golden Hour',         sub: 'Sunset, Warm backlight' },
  { id: 'urban',        label: 'Urban Street',        sub: 'City, Architecture' },
  { id: 'nature',       label: 'Nature & Garden',     sub: 'Greenery, Organic' },
  { id: 'night_neon',   label: 'Night Neon',          sub: 'City night, Neon glow' },
];

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className="px-3 py-2 rounded-xl text-left transition-all duration-150 border"
              style={active ? {
                background: 'rgba(232,168,71,0.12)',
                borderColor: 'rgba(232,168,71,0.35)',
                color: 'var(--gold)',
              } : {
                background: 'var(--bg-surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-2)',
              }}
            >
              <div className="text-xs font-semibold whitespace-nowrap">{opt.label}</div>
              <div className="text-xs opacity-60 whitespace-nowrap">{opt.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StyleSelector({ value, onChange }) {
  const [open, setOpen] = useState(true);

  const hasCustom =
    value.kol_style !== 'auto' || value.mood !== 'auto' || value.setting !== 'auto';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ background: 'transparent' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Phong cách & Style</span>
          {hasCustom && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,168,71,0.12)', color: 'var(--gold)' }}>
              Đã tuỳ chỉnh
            </span>
          )}
        </div>
        <span className="text-xs transition-transform duration-200" style={{ color: 'var(--text-3)', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 slide-up" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="pt-4">
            <OptionGroup label="KOL Style" options={KOL_STYLES} value={value.kol_style} onChange={v => onChange({ ...value, kol_style: v })} />
          </div>
          <OptionGroup label="Visual Mood" options={MOODS} value={value.mood} onChange={v => onChange({ ...value, mood: v })} />
          <OptionGroup label="Bối cảnh / Setting" options={SETTINGS} value={value.setting} onChange={v => onChange({ ...value, setting: v })} />
          {hasCustom && (
            <button onClick={() => onChange({ kol_style: 'auto', mood: 'auto', setting: 'auto' })} className="text-xs" style={{ color: 'var(--text-3)' }}>
              ↩ Reset về AI tự chọn
            </button>
          )}
        </div>
      )}
    </div>
  );
}
