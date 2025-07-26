
import { useState } from 'react';
import { Heart, Car as CarIcon } from 'lucide-react';
import MobileCarBadges from './MobileCarBadges';

interface MobileCarImageProps {
  images: string[];
  title: string;
  featured?: boolean;
  verified?: boolean;
  seller_type?: 'individual' | 'dealer';
  dealerVerified?: boolean;
  isSaved: boolean;
  isSaving?: boolean;
  onSave: () => void;
}

const MobileCarImage = ({ 
  images, 
  title, 
  featured, 
  verified, 
  seller_type,
  dealerVerified,
  isSaved, 
  isSaving = false, 
  onSave 
}: MobileCarImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  // Check if we have valid images
  const hasImages = images && images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  return (
    <div className="relative">
      <div 
        className="relative h-48 bg-gray-100 overflow-hidden rounded-lg"
        onTouchStart={(e) => {
          if (!hasImages) return; // Don't handle swipe if no images
          e.stopPropagation();
          const touchStart = e.touches[0].clientX;
          const handleTouchEnd = (endEvent: TouchEvent) => {
            const touchEnd = endEvent.changedTouches[0].clientX;
            const diff = touchStart - touchEnd;
            if (Math.abs(diff) > 50) {
              handleImageSwipe(diff > 0 ? 'right' : 'left');
            }
            document.removeEventListener('touchend', handleTouchEnd);
          };
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        {hasImages && currentImage ? (
          <img 
            src={currentImage} 
            alt={title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.parentElement?.querySelector('.placeholder') as HTMLElement;
              if (placeholder) {
                placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}
        
        {/* Placeholder when no images */}
        <div className={`w-full h-full flex items-center justify-center rounded-lg ${hasImages ? 'placeholder hidden' : ''}`}>
          <div className="text-center">
            <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No Image</p>
          </div>
        </div>
        
        <MobileCarBadges 
          featured={featured} 
          verified={verified} 
          seller_type={seller_type}
          dealerVerified={dealerVerified}
        />

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
        >
          {isSaving ? (
            <span className="loader h-5 w-5" />
          ) : (
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          )}
        </button>

        {/* Image Dots - only show if we have multiple images */}
        {hasImages && images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCarImage;
