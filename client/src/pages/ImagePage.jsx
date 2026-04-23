import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader.jsx';
import PromptCard from '../components/PromptCard.jsx';
import { useImagePrompt } from '../hooks/useImagePrompt.js';

export default function ImagePage() {
  const [kolFile, setKolFile] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const { result, loading, error, generate } = useImagePrompt();

  function handleGenerate() {
    if (kolFile && productFile) generate(kolFile, productFile);
  }

  return (
    <div className="space-y-6">
      <ImageUploader
        kolFile={kolFile}
        productFile={productFile}
        onKol={setKolFile}
        onProduct={setProductFile}
      />

      <button
        onClick={handleGenerate}
        disabled={!kolFile || !productFile || loading}
        className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
          bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        {loading ? 'Đang phân tích...' : 'Generate Prompts'}
      </button>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <PromptCard label="Pose Prompt" icon="📸" prompt={result.pose_prompt} color="purple" />
          <PromptCard label="Motion Prompt" icon="▶️" prompt={result.motion_prompt} color="blue" />
          <PromptCard label="Continuation Prompt" icon="⏭️" prompt={result.continuation_prompt} color="cyan" />
        </div>
      )}
    </div>
  );
}
