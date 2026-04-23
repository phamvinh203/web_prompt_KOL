import { useState } from 'react';
import { ScanSearch, Loader2 } from 'lucide-react';
import VideoUploader from '../components/VideoUploader.jsx';
import VideoSegmentList from '../components/VideoSegmentList.jsx';
import { useVideoPrompt } from '../hooks/useVideoPrompt.js';

export default function VideoPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [segmentDuration, setSegmentDuration] = useState(3);
  const { result, loading, error, analyze } = useVideoPrompt();

  function handleAnalyze() {
    if (videoFile) analyze(videoFile, segmentDuration);
  }

  return (
    <div className="space-y-6">
      <VideoUploader
        file={videoFile}
        onFile={setVideoFile}
        segmentDuration={segmentDuration}
        onSegmentDuration={setSegmentDuration}
      />

      <button
        onClick={handleAnalyze}
        disabled={!videoFile || loading}
        className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
          bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ScanSearch size={18} />}
        {loading ? 'Đang phân tích video...' : 'Phân tích Video'}
      </button>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && <VideoSegmentList segments={result.segments} />}
    </div>
  );
}
