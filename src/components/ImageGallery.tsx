import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn,
  Download
} from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  primaryImage: string;
  title: string;
}

export const ImageGallery = ({ images, primaryImage, title }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Combine primary image with additional images and remove duplicates
  const allImages = Array.from(new Set([primaryImage, ...(images || [])])).filter(img => img && typeof img === 'string');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = allImages[currentImageIndex];
    link.download = `${title}-image-${currentImageIndex + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (allImages.length === 0) {
    return (
      <div className="bg-black/40 border border-white/10 rounded-xl h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-kaki-grey">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div className="aspect-video bg-black/40 border border-white/10 rounded-xl overflow-hidden">
          <img
            src={allImages[currentImageIndex]}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Image Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image Actions */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={openFullscreen}
            className="bg-black/60 hover:bg-black/80 text-white"
            size="sm"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={downloadImage}
            className="bg-black/60 hover:bg-black/80 text-white"
            size="sm"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 relative group/thumbnail ${
                currentImageIndex === index 
                  ? 'ring-2 ring-purple-400' 
                  : 'ring-1 ring-white/20'
              } rounded-lg overflow-hidden transition-all`}
            >
              <div className="w-20 h-20 bg-black/40">
                <img
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=200&q=80';
                  }}
                />
              </div>
              
              {/* Thumbnail Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {index + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={allImages[currentImageIndex]}
              alt={`${title} - Fullscreen Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            {/* Close Button */}
            <Button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded">
              <p className="text-sm">{title}</p>
              <p className="text-xs opacity-75">Image {currentImageIndex + 1} of {allImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
