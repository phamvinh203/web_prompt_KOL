import { useState } from 'react';
import ImageUploader from '../components/ImageUploader.jsx';
import StyleSelector from '../components/StyleSelector.jsx';
import PromptCard from '../components/PromptCard.jsx';
import { useImagePrompt } from '../hooks/useImagePrompt.js';

const DEFAULT_STYLE = { kol_style: 'auto', mood: 'auto', setting: 'auto' };

export default function ImagePage() {
  const [kolFile, setKolFile] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [styleOptions, setStyleOptions] = useState(DEFAULT_STYLE);
  const { result, loading, error, generate } = useImagePrompt();

  const canGenerate = kolFile && productFile && !loading;

  return (
    <div className="space-y-5">
      {/* Upload zone */}
      <ImageUploader
        kolFile={kolFile}
        productFile={productFile}
        onKol={setKolFile}
        onProduct={setProductFile}
      />

      {/* Style selector */}
      <StyleSelector value={styleOptions} onChange={setStyleOptions} />

      {/* Generate button */}
      <button
        onClick={() => generate(kolFile, productFile, styleOptions)}
        disabled={!canGenerate}
        className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#09090f' }} />
            Gemini đang phân tích...
          </>
        ) : (
          <>
            <span>✦</span>
            Generate Prompts
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(240,106,126,0.1)', border: '1px solid rgba(240,106,126,0.25)', color: 'var(--rose)' }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Label header */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>Kết quả</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Bilingual note */}
          <div className="flex items-center gap-4 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-3)' }} />
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>Trái: English prompt (dùng cho GROK)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-dim)' }} />
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>Phải: Tiếng Việt (tham khảo)</span>
            </div>
          </div>

          <PromptCard type="pose"         promptData={result.pose_prompt} />
          <PromptCard type="motion"       promptData={result.motion_prompt} />
          <PromptCard type="continuation" promptData={result.continuation_prompt} />
        </div>
      )}
    </div>
  );
}
