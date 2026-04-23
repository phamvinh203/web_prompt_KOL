import { useRef, useState } from 'react';
import { Upload, X, Film } from 'lucide-react';

export default function VideoUploader({ file, onFile, segmentDuration, onSegmentDuration }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('video/')) onFile(f);
  }

  return (
    <div className="space-y-4">
      {file ? (
        <div className="relative rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
          <Film size={20} className="text-purple-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
          <button onClick={() => onFile(null)} className="p-1 hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${dragging ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 hover:border-white/40 bg-white/5'}`}
        >
          <Upload size={28} className="text-gray-500 mb-2" />
          <span className="text-sm text-gray-400">Click hoặc kéo thả video vào đây</span>
          <span className="text-xs text-gray-600 mt-1">MP4, MOV, AVI — tối đa 200MB</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400 whitespace-nowrap">Chia đoạn mỗi:</label>
        <div className="flex gap-2">
          {[3, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => onSegmentDuration(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${segmentDuration === s ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
