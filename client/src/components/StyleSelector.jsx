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

const SCENARIOS = [
  { id: 'mirror_selfie',    icon: '🪞', label: 'Khoe đồ trước gương',       sub: 'Cầm điện thoại tự quay, outfit reveal trước gương' },
  { id: 'unboxing_reveal',  icon: '📦', label: 'Khui đồ & mặc thử',         sub: 'Mở hộp → che camera → bất ngờ reveal mặc lên người' },
  { id: 'before_after',     icon: '✨', label: 'Transition Before/After',    sub: 'Biến hình từ bình thường → có đồ, hiệu ứng chuyển cảnh mượt' },
  { id: 'street_cafe',      icon: '☕', label: 'Đi đường / Cafe Lookbook',   sub: 'Lifestyle ngoài đường, ngồi cafe, đi dạo phong cách tự nhiên' },
  { id: 'body_review',      icon: '👗', label: 'Review dáng người thật',     sub: 'Thử đồ trên dáng thật, nhận xét form, size, độ vừa vặn' },
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

const DEFAULT_VALUE = { kol_style: 'auto', mood: 'auto', setting: 'auto', scenario: 'auto' };

export default function StyleSelector({ value, onChange }) {
  const [showScenario, setShowScenario] = useState(false);

  const hasCustom = value.kol_style !== 'auto' || value.mood !== 'auto' || value.setting !== 'auto';
  const scenarioActive = value.scenario !== 'auto';
  const activeScenario = SCENARIOS.find(s => s.id === value.scenario);

  function reset() { onChange(DEFAULT_VALUE); setShowScenario(false); }

  function toggleScenario() {
    if (showScenario) {
      // Tắt → reset scenario về auto
      onChange({ ...value, scenario: 'auto' });
    }
    setShowScenario(v => !v);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Tùy chỉnh phong cách</span>
        {(hasCustom || scenarioActive) && (
          <button onClick={reset} style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'underline', cursor: 'pointer' }}>Đặt lại</button>
        )}
      </div>

      <OptionRow label="Phong cách KOL" options={KOL_STYLES} value={value.kol_style} onChange={v => onChange({ ...value, kol_style: v })} />
      <OptionRow label="Không khí"      options={MOODS}      value={value.mood}      onChange={v => onChange({ ...value, mood: v })} />
      <OptionRow label="Bối cảnh"       options={SETTINGS}   value={value.setting}   onChange={v => onChange({ ...value, setting: v })} />

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 0 14px' }} />

      {/* Scenario toggle header */}
      <button
        onClick={toggleScenario}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
          background: showScenario ? 'var(--accent-dim)' : 'var(--bg-surface)',
          border: `1px solid ${showScenario ? 'rgba(124,106,245,0.3)' : 'var(--border)'}`,
          transition: 'all 150ms',
          marginBottom: showScenario ? 10 : 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13 }}>🎬</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: showScenario ? 'var(--accent)' : 'var(--text-2)', letterSpacing: '0.05em' }}>
              KỊCH BẢN VIDEO
            </div>
            {!showScenario && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>
                {scenarioActive ? `Đang dùng: ${activeScenario?.label}` : 'Tùy chọn — bấm để mở'}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {scenarioActive && !showScenario && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          )}
          <span style={{
            fontSize: 10, color: 'var(--text-3)',
            transform: showScenario ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms', display: 'inline-block',
          }}>▼</span>
        </div>
      </button>

      {/* Scenario options — shown when expanded */}
      {showScenario && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 10, color: 'var(--text-3)', margin: '0 0 8px 2px', lineHeight: 1.5 }}>
            Thêm cốt truyện hành động. Phong cách & mood vẫn áp dụng đầy đủ.
          </p>
          {SCENARIOS.map(opt => {
            const active = value.scenario === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onChange({ ...value, scenario: active ? 'auto' : opt.id })}
                className={`option-btn${active ? ' active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', textAlign: 'left', width: '100%' }}
              >
                <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{opt.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.3 }}>{opt.sub}</div>
                </div>
                {active && <span style={{ fontSize: 10, color: 'var(--accent)' }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
