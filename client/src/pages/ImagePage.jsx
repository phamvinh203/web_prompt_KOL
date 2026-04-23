import { useState } from 'react';
import ImageUploader from '../components/ImageUploader.jsx';
import StyleSelector from '../components/StyleSelector.jsx';
import PromptCard from '../components/PromptCard.jsx';
import { useImagePrompt } from '../hooks/useImagePrompt.js';

const DEFAULT_STYLE = { kol_style: 'auto', mood: 'auto', setting: 'auto' };

export default function ImagePage() {
  const [kolFile, setKolFile]     = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [styleOptions, setStyleOptions] = useState(DEFAULT_STYLE);
  const { result, loading, error, generate } = useImagePrompt();

  const canGenerate = kolFile && productFile && !loading;

  return (
    <div>
      {/* ── Top row: left = Style, right = Upload ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Left panel — Style selector */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '20px 16px',
          position: 'sticky',
          top: 72,
        }}>
          <StyleSelector value={styleOptions} onChange={setStyleOptions} />
        </div>

        {/* Right panel — Upload + Generate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Upload */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 16 }}>
              Upload ảnh
            </p>
            <ImageUploader
              kolFile={kolFile}
              productFile={productFile}
              onKol={setKolFile}
              onProduct={setProductFile}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={() => generate(kolFile, productFile, styleOptions)}
            disabled={!canGenerate}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
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
            <div style={{ background: 'var(--rose-dim)', border: '1px solid rgba(232,106,126,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--rose)' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom: Prompt results ── */}
      {result && (
        <div style={{ marginTop: 32 }} className="slide-up">
          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
              3 Prompts cho GROK AI
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 16, paddingLeft: 4 }}>
            {[
              { color: 'var(--text-2)', label: 'EN — English prompt (dùng cho GROK)' },
              { color: 'var(--amber)', label: 'VI — Tiếng Việt (tham khảo)' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PromptCard type="pose"         promptData={result.pose_prompt} />
            <PromptCard type="motion"       promptData={result.motion_prompt} />
            <PromptCard type="continuation" promptData={result.continuation_prompt} />
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
