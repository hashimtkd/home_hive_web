import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, Trash2 } from 'lucide-react';
import { compressImage, formatBytes, type CompressedImageResult } from '../../utils/imageCompression';
import { cn } from '../../utils/cn';

interface ImageUploaderProps {
  onNewImagesChange: (images: CompressedImageResult[]) => void;
  onExistingImagesChange: (images: string[]) => void;
  existingImages: string[];
  uploadProgress?: Record<number, number>;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onNewImagesChange,
  onExistingImagesChange,
  existingImages,
  uploadProgress = {},
  disabled = false
}) => {
  const [newImages, setNewImages] = useState<CompressedImageResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const compressedResults: CompressedImageResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await compressImage(files[i]);
        compressedResults.push(result);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert(error instanceof Error ? error.message : 'Failed to process image');
      }
    }

    const updatedNewImages = [...newImages, ...compressedResults];
    setNewImages(updatedNewImages);
    onNewImagesChange(updatedNewImages);
    setIsCompressing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeNewImage = (index: number) => {
    const updated = [...newImages];
    URL.revokeObjectURL(updated[index].previewUrl);
    updated.splice(index, 1);
    setNewImages(updated);
    onNewImagesChange(updated);
  };

  const removeExistingImage = (index: number) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    onExistingImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors relative",
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:bg-gray-50",
          disabled && "opacity-50 pointer-events-none"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          multiple
          accept="image/jpeg, image/jpg, image/png, image/webp"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">Click or drag images to upload</p>
          <p className="text-xs text-gray-500">JPG, PNG, WEBP (Optimized automatically)</p>
        </div>
      </div>

      {isCompressing && (
        <div className="text-sm text-indigo-600 animate-pulse flex items-center gap-2">
          <FileImage className="h-4 w-4" /> Optimizing images...
        </div>
      )}

      {(newImages.length > 0 || existingImages.length > 0) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Selected Images</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg relative group">
                <img src={url} alt={`Existing ${i}`} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Existing Image</p>
                  <p className="text-xs text-gray-500">Stored on Cloudinary</p>
                </div>
                {!disabled && (
                  <button type="button" onClick={() => removeExistingImage(i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            {newImages.map((img, i) => {
              const progress = uploadProgress[i];
              return (
                <div key={`new-${i}`} className="flex items-center gap-3 p-3 bg-white border rounded-lg relative overflow-hidden group shadow-sm">
                  <img src={img.previewUrl} alt={`New ${i}`} className="w-16 h-16 object-cover rounded-md z-10" />
                  <div className="flex-1 min-w-0 z-10">
                    <p className="text-sm font-medium text-gray-900 truncate" title={img.file.name}>{img.file.name}</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-1">
                      <span className="text-gray-400 line-through" title="Original Size">{formatBytes(img.originalSize)}</span>
                      <span className="text-emerald-600 font-medium" title="Optimized Size">{formatBytes(img.optimizedSize)}</span>
                    </div>
                  </div>
                  {!disabled && typeof progress === 'undefined' && (
                    <button type="button" onClick={() => removeNewImage(i)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors z-10">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {typeof progress === 'number' && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-indigo-50/80 transition-all duration-300 ease-out z-0 border-r border-indigo-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  {typeof progress === 'number' && (
                    <div className="absolute right-3 text-xs font-semibold text-indigo-700 z-10 bg-white/50 px-2 py-1 rounded">
                      {progress}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
