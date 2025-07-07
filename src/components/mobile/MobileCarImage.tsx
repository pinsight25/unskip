
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import MobileCarBadges from './MobileCarBadges';

interface MobileCarImageProps {
  images: string[];
  title: string;
  featured?: boolean;
  verified?: boolean;
  isSaved: boolean;
  onSave: () => void;
  carId?: string;
}

const MobileCarImage = ({ 
  images, 
  title, 
  featured, 
  verified, 
  isSaved, 
  onSave,
  carId
}: MobileCarImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const ImageContent = () => (
    <div 
      className="relative h-48 bg-gray-100 overflow-hidden"
      onTouchStart={(e) => {
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
      <img 
        src={images[currentImageIndex]} 
        alt={title}
        className="w-full h-full object-cover"
      />
      
      <MobileCarBadges featured={featured} verified={verified} />

      {/* Save Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSave();
        }}
        className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm z-10"
      >
        <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
      </button>

      {/* Image Dots */}
      {images.length > 1 && (
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
  );

  return (
    <div className="relative">
      {carId ? (
        <Link to={`/car/${carId}`} className="block">
          <ImageContent />
        </Link>
      ) : (
        <ImageContent />
      )}
    </div>
  );
};

export default MobileCarImage;
