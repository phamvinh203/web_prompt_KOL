import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function PromptCard({ label, icon, prompt, color = 'purple' }) {
  const [copied, setCopied] = useState(false);

  const colorMap = {
    purple: 'border-purple-500/30 bg-purple-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    cyan: 'border-cyan-500/30 bg-cyan-500/5',
  };

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{prompt}</p>
    </div>
  );
}
