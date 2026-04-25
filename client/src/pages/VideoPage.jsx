import { useState, useEffect } from 'react';
import VideoUploader from '../components/VideoUploader.jsx';
import VideoSegmentList from '../components/VideoSegmentList.jsx';
import { useVideoPrompt } from '../hooks/useVideoPrompt.js';

const STEP_LABEL = {
  uploading: 'Đang tải video lên...',
  splitting: 'Đang tách video thành đoạn...',
};

function AnalysisProgress({ progress }) {
  const { step, current, total } = progress;
  if (step === 'idle') return null;

  const isAnalyzing = step === 'analyzing';
  const percent = isAnalyzing && total > 0 ? Math.round((current / total) * 100) : 0;
  const label = isAnalyzing ? `Đang phân tích đoạn ${current}/${total}` : (STEP_LABEL[step] ?? 'Đang xử lý...');

  return (
    <div
      className="rounded-xl px-4 py-3 space-y-2 slide-up"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border-2 animate-spin shrink-0"
            style={{ borderColor: 'rgba(232,168,71,0.25)', borderTopColor: 'rgba(232,168,71,0.9)' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-2)' }}>{label}</span>
        </div>
        {isAnalyzing && (
          <span className="text-xs font-semibold tabular-nums" style={{ color: 'rgba(232,168,71,0.9)' }}>{percent}%</span>
        )}
      </div>

      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        {isAnalyzing ? (
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%`, background: 'rgba(232,168,71,0.85)' }}
          />
        ) : (
          <div
            className="h-full w-2/5 rounded-full"
            style={{ background: 'rgba(232,168,71,0.7)', animation: 'progressSlide 1.4s ease-in-out infinite' }}
          />
        )}
      </div>

      {isAnalyzing && total > 0 && (
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{
                minWidth: '6px',
                background: i < current
                  ? 'rgba(232,168,71,0.85)'
                  : i === current
                    ? 'rgba(232,168,71,0.4)'
                    : 'var(--bg-surface)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function VideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState(null);
  const [segmentDuration, setSegmentDuration] = useState(3);
  const { result, loading, error, progress, analyze } = useVideoPrompt();

  useEffect(() => {
    if (!videoFile) { setVideoObjectUrl(null); return; }
    const url = URL.createObjectURL(videoFile);
    setVideoObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  function buttonContent() {
    if (!loading) return <><span>⬡</span> Phân tích Video</>;
    const { step, current, total } = progress;
    const label =
      step === 'uploading' ? 'Đang tải lên...' :
      step === 'splitting' ? 'Đang tách đoạn...' :
      step === 'analyzing' ? `Phân tích ${current}/${total}` :
      'Đang xử lý...';
    return (
      <>
        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#fff' }} />
        {label}
      </>
    );
  }

  return (
    <div className="space-y-5">
      <VideoUploader
        file={videoFile}
        videoUrl={videoObjectUrl}
        onFile={setVideoFile}
        segmentDuration={segmentDuration}
        onSegmentDuration={setSegmentDuration}
      />

      <button
        onClick={() => analyze(videoFile, segmentDuration)}
        disabled={!videoFile || loading}
        className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
      >
        {buttonContent()}
      </button>

      {loading && <AnalysisProgress progress={progress} />}

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(240,106,126,0.1)', border: '1px solid rgba(240,106,126,0.25)', color: 'var(--rose)' }}>
          {error}
        </div>
      )}

      {result && <VideoSegmentList segments={result.segments} videoUrl={videoObjectUrl} />}
    </div>
  );
}
