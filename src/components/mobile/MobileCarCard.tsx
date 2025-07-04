
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Calendar,
  MapPin,
  Fuel,
  Settings,
  Users,
  Star,
  Shield,
  Award
} from 'lucide-react';

interface MobileCarCardProps {
  car: any;
  onSave: (carId: string) => void;
  isSaved: boolean;
  onMakeOffer: () => void;
  onChat: () => void;
  onTestDrive: () => void;
}

const MobileCarCard = ({ car, onSave, isSaved, onMakeOffer, onChat, onTestDrive }: MobileCarCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatRental = (rate: number) => {
    return `₹${rate.toLocaleString()}/day`;
  };

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };

  return (
    <Card className="mb-4 mx-4 overflow-hidden shadow-sm border border-gray-200 bg-white cursor-pointer" onClick={handleCardClick}>
      {/* Image Section */}
      <div className="relative">
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
            src={car.images[currentImageIndex]} 
            alt={car.title}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {car.featured && (
              <Badge className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {car.verified && (
              <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(car.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>

          {/* Image Dots */}
          {car.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {car.images.map((_, index) => (
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

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {car.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(car.price)}
              </span>
              {car.rentalRate && (
                <span className="text-sm text-gray-500 ml-2">
                  or {formatRental(car.rentalRate)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">{car.mileage.toLocaleString()} km</span>
          </div>
        </div>

        {/* Location and Seller */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{car.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {car.seller.rating && (
                <>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-700 font-medium">{car.seller.rating}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onMakeOffer();
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-11"
          >
            Make an Offer
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onChat();
              }}
              className="h-10 text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onTestDrive();
              }}
              className="h-10 text-sm font-medium"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Test Drive
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MobileCarCard;
