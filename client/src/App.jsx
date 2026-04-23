import { useState } from 'react';
import ImagePage from './pages/ImagePage.jsx';
import VideoPage from './pages/VideoPage.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';

const tabs = [
  { id: 'image', label: 'KOL × Sản phẩm', sub: 'Ảnh → 3 Prompts' },
  { id: 'video', label: 'Phân tích Video', sub: 'Tách đoạn → Motion' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)', background: 'rgba(17,17,25,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'var(--gold)', color: '#09090f' }}>K</div>
            <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-1)' }}>KOL Prompt Studio</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(232,168,71,0.12)', color: 'var(--gold)' }}>GROK AI</span>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>Powered by Gemini 2.5 Flash</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Tab switcher */}
        <div className="flex gap-1 p-1 rounded-2xl mb-8" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 px-4 rounded-xl transition-all duration-200 text-left"
              style={activeTab === tab.id
                ? { background: 'var(--bg-hover)', borderColor: 'var(--border-active)' }
                : { background: 'transparent' }
              }
            >
              <div className="text-sm font-semibold" style={{ color: activeTab === tab.id ? 'var(--text-1)' : 'var(--text-3)' }}>{tab.label}</div>
              <div className="text-xs mt-0.5" style={{ color: activeTab === tab.id ? 'var(--text-2)' : 'var(--text-3)' }}>{tab.sub}</div>
            </button>
          ))}
        </div>

        {/* Page content */}
        <div className="fade-in" key={activeTab}>
          {activeTab === 'image' ? <ImagePage /> : <VideoPage />}
        </div>

        {/* History */}
        <HistoryPanel />
      </main>
    </div>
  );
}
