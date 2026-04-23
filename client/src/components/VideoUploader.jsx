import { useRef, useState } from 'react';

export default function VideoUploader({ file, onFile, segmentDuration, onSegmentDuration }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith('video/')) onFile(f);
  }

  return (
    <div className="space-y-4">
      {file ? (
        <div className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(232,168,71,0.1)', border: '1px solid rgba(232,168,71,0.2)' }}>
            <span>🎬</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>{file.name}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
          <button onClick={() => onFile(null)} className="text-xs px-3 py-1.5 rounded-xl transition-colors" style={{ background: 'var(--bg-surface)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>
            Xoá
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="h-40 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            border: `2px dashed ${dragging ? 'var(--gold)' : 'var(--border)'}`,
            background: dragging ? 'rgba(232,168,71,0.04)' : 'var(--bg-surface)',
          }}
        >
          <span className="text-2xl mb-2">🎬</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>Click hoặc kéo thả video</span>
          <span className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>MP4, MOV, AVI — tối đa 200MB</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />

      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>Chia đoạn mỗi</span>
        <div className="flex gap-2">
          {[3, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => onSegmentDuration(s)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border"
              style={segmentDuration === s
                ? { background: 'rgba(232,168,71,0.12)', borderColor: 'rgba(232,168,71,0.35)', color: 'var(--gold)' }
                : { background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-3)' }
              }
            >
              {s}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
