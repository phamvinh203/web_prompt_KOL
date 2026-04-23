import { useEffect, useState } from 'react';
import { Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api.js';

function ImageHistoryItem({ item, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(!open)}>
          <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString('vi-VN')}</p>
          <p className="text-sm font-medium truncate mt-0.5">{item.kol_filename} + {item.product_filename}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => setOpen(!open)} className="p-1 text-gray-500 hover:text-gray-300">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-3 space-y-2 text-xs text-gray-400 border-t border-white/10 pt-3">
          <p><span className="text-purple-400 font-medium">Pose:</span> {item.pose_prompt}</p>
          <p><span className="text-blue-400 font-medium">Motion:</span> {item.motion_prompt}</p>
          <p><span className="text-cyan-400 font-medium">Continuation:</span> {item.continuation_prompt}</p>
        </div>
      )}
    </div>
  );
}

export default function HistoryPanel() {
  const [images, setImages] = useState([]);
  const [tab, setTab] = useState('images');

  useEffect(() => {
    api.get('/history/images').then(r => setImages(r.data)).catch(() => {});
  }, []);

  async function deleteImage(id) {
    await api.delete(`/history/images/${id}`);
    setImages(prev => prev.filter(i => i._id !== id));
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-500" />
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Lịch sử</h2>
      </div>
      {images.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-6">Chưa có lịch sử</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {images.map(item => (
            <ImageHistoryItem key={item._id} item={item} onDelete={deleteImage} />
          ))}
        </div>
      )}
    </div>
  );
}
