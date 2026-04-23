import { useState } from 'react';

const KOL_STYLES = [
  { id: 'auto',      icon: '✦', label: 'AI Tự chọn',    sub: 'Gemini phân tích tự động' },
  { id: 'luxury',    icon: '💎', label: 'Sang trọng',    sub: 'Thời trang cao cấp, Haute couture' },
  { id: 'street',    icon: '🏙', label: 'Đường phố',     sub: 'Cá tính, năng động, đô thị' },
  { id: 'kbeauty',   icon: '🌸', label: 'K-Beauty',      sub: 'Mềm mại, tự nhiên, làn da căng bóng' },
  { id: 'editorial', icon: '📸', label: 'Tạp chí',       sub: 'Nghệ thuật, sáng tạo, ấn tượng' },
  { id: 'sporty',    icon: '⚡', label: 'Thể thao',      sub: 'Năng động, khỏe khoắn, mạnh mẽ' },
  { id: 'vintage',   icon: '🎞', label: 'Cổ điển',       sub: 'Hạt phim, tông ấm, hoài niệm' },
];

const MOODS = [
  { id: 'auto',       icon: '✦', label: 'AI Tự chọn',   sub: 'Gemini phân tích tự động' },
  { id: 'cinematic',  icon: '🎬', label: 'Điện ảnh',     sub: 'Kịch tính, đậm chất phim ảnh' },
  { id: 'dreamy',     icon: '☁️', label: 'Mơ mộng',      sub: 'Nhẹ nhàng, bokeh mềm mại' },
  { id: 'vibrant',    icon: '🌈', label: 'Sôi động',     sub: 'Màu sắc nổi bật, tràn đầy năng lượng' },
  { id: 'minimal',    icon: '◻',  label: 'Tối giản',     sub: 'Sạch sẽ, tinh tế, hiện đại' },
  { id: 'moody',      icon: '🌑', label: 'Huyền bí',     sub: 'Tối tăm, sâu lắng, bí ẩn' },
];

const SETTINGS = [
  { id: 'auto',        icon: '✦', label: 'AI Tự chọn',  sub: 'Gemini phân tích tự động' },
  { id: 'studio',      icon: '🏳', label: 'Studio',      sub: 'Phông trắng, ánh sáng kiểm soát' },
  { id: 'golden_hour', icon: '🌅', label: 'Hoàng hôn',   sub: 'Ánh nắng ấm áp cuối ngày' },
  { id: 'urban',       icon: '🌆', label: 'Đô thị',      sub: 'Đường phố, kiến trúc thành phố' },
  { id: 'nature',      icon: '🌿', label: 'Thiên nhiên',  sub: 'Cây xanh, ánh sáng tự nhiên' },
  { id: 'night_neon',  icon: '🌃', label: 'Đêm Neon',    sub: 'Đèn neon lung linh, đêm thành phố' },
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
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Tùy chỉnh phong cách</span>
        {hasCustom && (
          <button onClick={reset} style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'underline' }}>Đặt lại</button>
        )}
      </div>

      <OptionRow label="Phong cách KOL" options={KOL_STYLES} value={value.kol_style} onChange={v => onChange({ ...value, kol_style: v })} />
      <OptionRow label="Không khí"      options={MOODS}      value={value.mood}      onChange={v => onChange({ ...value, mood: v })} />
      <OptionRow label="Bối cảnh"       options={SETTINGS}   value={value.setting}   onChange={v => onChange({ ...value, setting: v })} />
    </div>
  );
}
