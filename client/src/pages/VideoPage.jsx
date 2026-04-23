import { useState } from 'react';
import VideoUploader from '../components/VideoUploader.jsx';
import VideoSegmentList from '../components/VideoSegmentList.jsx';
import { useVideoPrompt } from '../hooks/useVideoPrompt.js';

export default function VideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [segmentDuration, setSegmentDuration] = useState(3);
  const { result, loading, error, analyze } = useVideoPrompt();

  return (
    <div className="space-y-5">
      <VideoUploader
        file={videoFile}
        onFile={setVideoFile}
        segmentDuration={segmentDuration}
        onSegmentDuration={setSegmentDuration}
      />

      <button
        onClick={() => analyze(videoFile, segmentDuration)}
        disabled={!videoFile || loading}
        className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#09090f' }} />
            Đang tách & phân tích...
          </>
        ) : (
          <>
            <span>⬡</span>
            Phân tích Video
          </>
        )}
      </button>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(240,106,126,0.1)', border: '1px solid rgba(240,106,126,0.25)', color: 'var(--rose)' }}>
          {error}
        </div>
      )}

      {result && <VideoSegmentList segments={result.segments} />}
    </div>
  );
}
