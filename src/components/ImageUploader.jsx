import { useState, useRef } from 'react';
import { Upload, X, Camera, Image } from 'lucide-react';

export default function ImageUploader({ onImageSelect, currentImage = null }) {
  const [preview, setPreview] = useState(currentImage);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageSelect && onImageSelect(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = () => {
    setPreview(null);
    onImageSelect && onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Food preview"
            className="w-full h-48 object-cover rounded-xl border border-white/10"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg bg-rose-500/80 text-white hover:bg-rose-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-primary-500/80 text-white text-xs font-medium flex items-center gap-1">
            <Camera size={10} /> Photo attached
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-white/10 bg-surface-900/50 hover:border-primary-500/30 hover:bg-surface-800/50'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/10 flex items-center justify-center">
            <Image size={18} className="text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">
            <span className="text-primary-400 font-medium">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-slate-600">PNG, JPG up to 5MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}
