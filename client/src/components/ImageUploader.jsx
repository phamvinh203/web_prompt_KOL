import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

function DropZone({ label, file, onFile, onClear }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) onFile(f);
  }

  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex-1">
      <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">{label}</p>
      {file ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-square">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${dragging ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 hover:border-white/40 bg-white/5'}`}
        >
          <Upload size={24} className="text-gray-500 mb-2" />
          <span className="text-xs text-gray-500">Click or drag & drop</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}

export default function ImageUploader({ kolFile, productFile, onKol, onProduct }) {
  return (
    <div className="flex gap-4">
      <DropZone label="KOL / Model" file={kolFile} onFile={onKol} onClear={() => onKol(null)} />
      <DropZone label="Sản phẩm" file={productFile} onFile={onProduct} onClear={() => onProduct(null)} />
    </div>
  );
}
