import { useState } from 'react';
import ImagePage from './pages/ImagePage.jsx';
import VideoPage from './pages/VideoPage.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';

const TABS = [
  { id: 'image', label: 'KOL × Sản phẩm', hint: 'Ảnh → 3 Prompts' },
  { id: 'video', label: 'Phân tích Video',  hint: 'Tách đoạn → Motion' },
];

export default function App() {
  const [tab, setTab] = useState('image');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sticky header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--border-soft)',
        background: 'rgba(12,12,16,0.85)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>K</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>KOL Prompt Studio</span>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(124,106,245,0.25)' }}>GROK AI</span>
          </div>

          {/* Tabs */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 3 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '5px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: tab === t.id ? 'var(--bg-raised)' : 'transparent',
                color: tab === t.id ? 'var(--text-1)' : 'var(--text-3)',
                border: tab === t.id ? '1px solid var(--border)' : '1px solid transparent',
                transition: 'all 150ms',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Được hỗ trợ bởi Gemini 2.5 Flash</span>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px' }}>
        <div className="fade-in" key={tab}>
          {tab === 'image' ? <ImagePage /> : <VideoPage />}
        </div>
        <HistoryPanel activeTab={tab} />
      </main>
    </div>
  );
}
