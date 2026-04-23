import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function SegmentRow({ seg }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(seg.motion_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
            Đoạn {seg.index}
          </span>
          <span className="text-xs text-gray-500">
            {seg.start}s — {seg.end}s
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{seg.motion_prompt}</p>
    </div>
  );
}

export default function VideoSegmentList({ segments }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">{segments.length} đoạn được phân tích</p>
      {segments.map(seg => <SegmentRow key={seg.index} seg={seg} />)}
    </div>
  );
}
