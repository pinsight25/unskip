
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import AccessoryImageModal from './AccessoryImageModal';

interface AccessoryImageGalleryProps {
  images: string[];
  name: string;
  selectedImage: number;
  onImageSelect: (index: number) => void;
  featured?: boolean;
  verified?: boolean;
}

const AccessoryImageGallery = ({ 
  images, 
  name, 
  selectedImage, 
  onImageSelect,
  featured,
  verified
}: AccessoryImageGalleryProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && selectedImage < images.length - 1) {
      onImageSelect(selectedImage + 1);
    } else if (direction === 'left' && selectedImage > 0) {
      onImageSelect(selectedImage - 1);
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
        >
          <img 
            src={images[selectedImage]} 
            alt={name}
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
                    index === selectedImage ? 'bg-white' : 'bg-white/50'
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
        {images.length > 1 && (
          <div className="hidden md:flex absolute top-1/2 transform -translate-y-1/2 w-full justify-between px-4 pointer-events-none">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleImageSwipe('left');
              }}
              className="bg-white/70 hover:bg-white rounded-full p-2 pointer-events-auto disabled:opacity-50"
              disabled={selectedImage === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleImageSwipe('right');
              }}
              className="bg-white/70 hover:bg-white rounded-full p-2 pointer-events-auto disabled:opacity-50"
              disabled={selectedImage === images.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>

      <AccessoryImageModal
        images={images}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialIndex={selectedImage}
        accessoryTitle={name}
      />
    </>
  );
};

export default AccessoryImageGallery;
