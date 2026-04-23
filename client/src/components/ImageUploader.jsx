import { useRef, useState } from 'react';

function DropZone({ label, badge, file, onFile, onClear }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) onFile(f);
  }

  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: 'rgba(232,168,71,0.1)', color: 'var(--gold)', border: '1px solid rgba(232,168,71,0.2)' }}>{badge}</span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>{label}</span>
      </div>

      {file ? (
        <div
          className="relative rounded-2xl overflow-hidden group"
          style={{ aspectRatio: '3/4', border: '1px solid var(--border)' }}
        >
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center" style={{ background: 'rgba(9,9,15,0.7)' }}>
            <button
              onClick={onClear}
              className="text-xs px-3 py-1.5 rounded-xl font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Xoá ảnh
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: 'linear-gradient(to top, rgba(9,9,15,0.9), transparent)' }}>
            <p className="text-xs truncate" style={{ color: 'var(--text-2)' }}>{file.name}</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            aspectRatio: '3/4',
            border: `2px dashed ${dragging ? 'var(--gold)' : 'var(--border)'}`,
            background: dragging ? 'rgba(232,168,71,0.05)' : 'var(--bg-surface)',
          }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '18px' }}>{badge === 'KOL' ? '👤' : '📦'}</span>
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>Click hoặc kéo thả</span>
          <span className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>JPG, PNG, WEBP</span>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
    </div>
  );
}

export default function ImageUploader({ kolFile, productFile, onKol, onProduct }) {
  return (
    <div className="flex gap-4">
      <DropZone badge="KOL" label="Model / Influencer" file={kolFile} onFile={onKol} onClear={() => onKol(null)} />
      <DropZone badge="SP" label="Sản phẩm" file={productFile} onFile={onProduct} onClear={() => onProduct(null)} />
    </div>
  );
}
