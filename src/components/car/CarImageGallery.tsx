
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shield, Award, Building2 } from 'lucide-react';
import CarImageModal from './CarImageModal';

interface CarImageGalleryProps {
  images: string[];
  title: string;
  featured?: boolean;
  verified?: boolean;
  seller?: {
    type?: 'individual' | 'dealer';
    verified?: boolean;
    dealerVerified?: boolean; // Added for dealer verification
  };
}

const CarImageGallery = ({ images, title, featured, verified, seller }: CarImageGalleryProps) => {
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
        >
          <img 
            src={images[currentImageIndex]} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {featured && (
              <Badge className="bg-amber-500 text-white text-xs font-medium px-2 py-1 shadow-lg">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {verified && (
              <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1 shadow-lg flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {/* Dealer verification badge - use dealerVerified only */}
            {seller?.type === 'dealer' && seller?.dealerVerified === true && (
              <Badge className="bg-blue-500 text-white text-xs font-medium px-2 py-1 shadow-lg">
                <Building2 className="h-3 w-3 mr-1" />
                Verified Dealer
              </Badge>
            )}
            {seller?.type === 'dealer' && seller?.dealerVerified === false && (
              <Badge className="bg-gray-500 text-white text-xs font-medium px-2 py-1 shadow-lg">
                <Building2 className="h-3 w-3 mr-1" />
                Unverified Dealer
              </Badge>
            )}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageSwipe('left');
                }}
                disabled={currentImageIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageSwipe('right');
                }}
                disabled={currentImageIndex === images.length - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentImageIndex 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
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
