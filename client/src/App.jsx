import { useState } from 'react';
import { ImageIcon, Video, Zap } from 'lucide-react';
import ImagePage from './pages/ImagePage.jsx';
import VideoPage from './pages/VideoPage.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';

const tabs = [
  { id: 'image', label: 'Ảnh KOL + Sản phẩm', icon: ImageIcon },
  { id: 'video', label: 'Phân tích Video', icon: Video },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">KOL Prompt Generator</h1>
            <p className="text-xs text-gray-500">Powered by Google Gemini → GROK AI</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
          {activeTab === 'image' ? <ImagePage /> : <VideoPage />}
        </div>

        {/* History */}
        <HistoryPanel />
      </div>
    </div>
  );
}
