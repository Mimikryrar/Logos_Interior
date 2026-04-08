import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_WIDTH = 1920;

interface UploadZoneProps {
  value?: string | null;
  onUpload: (base64: string | null, mimeType?: string) => void;
  className?: string;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadZone({ value, onUpload, className }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError('File too large. Please use an image under 10 MB.');
      return;
    }

    setSizeError(null);
    const compressed = await compressImage(file);
    onUpload(compressed, 'image/jpeg');
  }, [onUpload]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearPreview = () => {
    onUpload(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="wait">
        {!value ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center group cursor-pointer",
              isDragging
                ? "border-accent bg-accent/5 scale-[1.02]"
                : "border-ink/10 hover:border-ink/30 hover:bg-ink/[0.02]"
            )}
            onClick={() => document.getElementById('file-upload-drop')?.click()}
          >
            <input
              id="file-upload-drop"
              type="file"
              accept="image/*"
              aria-label="Upload room photo"
              className="hidden"
              onChange={onFileChange}
            />
            <div className="w-16 h-16 rounded-full bg-paper flex items-center justify-center mb-6 shadow-sm border border-ink/5 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2 tracking-tight">Upload your room photo</h3>
            <p className="text-sm text-ink/60 max-w-xs mx-auto leading-relaxed">
              Drag and drop your photo here, or click to browse. For best results, use a well-lit wide shot.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-3xl overflow-hidden border border-ink/10 shadow-lg group"
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-white text-ink px-4 py-2 rounded-full text-sm font-medium hover:bg-paper transition-colors flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" /> Change Photo
              </button>
              <button
                onClick={clearPreview}
                className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {sizeError && (
        <p className="text-sm text-red-500 mt-2 text-center">{sizeError}</p>
      )}
    </div>
  );
}
