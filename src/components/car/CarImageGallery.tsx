
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, RotateCcw } from 'lucide-react';
import CarImageModal from './CarImageModal';

interface CarImageGalleryProps {
  images: string[];
  title: string;
  featured?: boolean;
  verified?: boolean;
}

const CarImageGallery = ({ images, title, featured, verified }: CarImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="relative mb-6">
        <div 
          className="relative h-64 md:h-96 bg-gray-100 overflow-hidden rounded-lg cursor-pointer"
          onClick={handleImageClick}
          onTouchStart={(e) => {
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
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {featured && (
              <Badge className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {verified && (
              <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

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

          {/* Click hint */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Click to expand
          </div>
        </div>
        
        {/* Image Navigation Arrows - Desktop Only */}
        <div className="hidden md:flex absolute top-1/2 transform -translate-y-1/2 w-full justify-between px-4 pointer-events-none">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleImageSwipe('left');
            }}
            className="bg-white/70 hover:bg-white rounded-full p-2 pointer-events-auto"
            disabled={currentImageIndex === 0}
          >
            <RotateCcw className="h-6 w-6" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleImageSwipe('right');
            }}
            className="bg-white/70 hover:bg-white rounded-full p-2 pointer-events-auto"
            disabled={currentImageIndex === images.length - 1}
          >
            <RotateCcw className="h-6 w-6 transform rotate-180" />
          </button>
        </div>
      </div>

      <CarImageModal
        images={images}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialIndex={currentImageIndex}
        carTitle={title}
      />
    </>
  );
};

export default CarImageGallery;
