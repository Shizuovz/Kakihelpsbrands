import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  Trash2,
  MoveUp,
  MoveDown,
  Check,
  Loader2
} from "lucide-react";
import { API_BASE_URL } from "@/config";

interface MultiImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const MultiImageManager = ({ 
  images, 
  onImagesChange, 
  maxImages = 8 
}: MultiImageManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Check if total count will exceed max
    if (images.length + fileArray.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setIsUploading(true);
    const newImageUrls: string[] = [];
    
    try {
      // We can upload all files at once as an array
      const formData = new FormData();
      fileArray.forEach(file => {
        // Validate each file
        if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
          formData.append('images', file);
        }
      });

      if (formData.getAll('images').length === 0) {
        alert('No valid images selected (max 5MB, JPG/PNG/WebP)');
        setIsUploading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        // Extract URLs from result.data array
        const uploadedUrls = result.data.map((item: any) => item.url);
        onImagesChange([...images, ...uploadedUrls]);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload images to cloud. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files) return;

    // Convert FileList to array and process
    const fileArray = Array.from(files);
    const fakeEvent = { target: { files: fileArray as any } } as React.ChangeEvent<HTMLInputElement>;
    handleFileUpload(fakeEvent);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      onImagesChange(newImages);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && images.length < maxImages) {
      onImagesChange([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropImage = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    // Get the drop target index from the element
    const target = e.currentTarget as HTMLElement;
    const dropIndex = parseInt(target.getAttribute('data-index') || '0');

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove from old position
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-kaki-grey">
          Additional Images ({images.length}/{maxImages})
        </label>
        
        {/* Drag & Drop Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isUploading ? 'border-purple-400 bg-purple-400/5' : 'border-white/20 hover:border-purple-400/50'
          }`}
          onClick={isUploading ? undefined : triggerFileInput}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium mb-2">Uploading to Cloud...</p>
              <p className="text-kaki-grey text-sm">Please wait while we secure your assets</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Upload Images from Your System
              </p>
              <p className="text-kaki-grey text-sm mb-4">
                Drag & drop images here or click to browse
              </p>
              <div className="text-xs text-kaki-grey">
                <p>• Supported formats: JPG, PNG, GIF, WebP</p>
                <p>• Maximum file size: 5MB per image</p>
                <p>• Maximum {maxImages} images total</p>
              </div>
            </>
          )}
        </div>

        {/* URL Input Section */}
        <div className="flex gap-2">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Or enter image URL..."
            className="bg-black/40 border-white/10 text-white flex-1"
          />
          <Button 
            onClick={addImageUrl}
            disabled={!newImageUrl.trim() || images.length >= maxImages}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-kaki-grey">
              Image Gallery
            </label>
            <span className="text-xs text-kaki-grey">
              Drag to reorder
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOverImage}
                onDrop={handleDropImage}
                data-index={index}
                className="relative group cursor-move"
              >
                {/* Image Container */}
                <div className="aspect-square bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Hoarding image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-2">
                  <div className="flex flex-col h-full justify-between">
                    {/* Image Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white bg-purple-600 px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="p-1 bg-white/20 rounded hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MoveUp className="w-3 h-3 text-white" />
                        </button>
                        <button
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === images.length - 1}
                          className="p-1 bg-white/20 rounded hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MoveDown className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="p-2 bg-white/20 rounded hover:bg-white/30"
                        title="View full size"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 bg-red-500/20 rounded hover:bg-red-500/30"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drag Indicator */}
                {draggedIndex === index && (
                  <div className="absolute inset-0 border-2 border-purple-400 rounded-lg pointer-events-none">
                    <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image Count Info */}
          <div className="flex items-center justify-between text-xs text-kaki-grey">
            <span>{images.length} image{images.length !== 1 ? 's' : ''} added</span>
            <span>First image will be the primary display image</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
          <ImageIcon className="w-12 h-12 text-kaki-grey mx-auto mb-2" />
          <p className="text-kaki-grey text-sm">No images uploaded yet</p>
          <p className="text-kaki-grey text-xs mt-1">Upload images to showcase different angles</p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
        <p className="text-xs text-purple-300">
          <strong>Tips:</strong> Upload high-quality images from your system or add image URLs. Show the hoarding from different angles, distances, and lighting conditions to help clients make better decisions.
        </p>
      </div>
    </div>
  );
};

export default MultiImageManager;
