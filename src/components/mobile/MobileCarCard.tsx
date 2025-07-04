
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Shield, Calendar, Fuel, Settings, Heart, Share2, MessageCircle, DollarSign, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MobileCarCardProps {
  car: Car;
  onSave?: (carId: string) => void;
  isSaved?: boolean;
  onMakeOffer: () => void;
  onChat: () => void;
  onTestDrive: () => void;
}

const MobileCarCard = ({ car, onSave, isSaved = false, onMakeOffer, onChat, onTestDrive }: MobileCarCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(car.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car.title,
        text: `Check out this ${car.title} for ${formatPrice(car.price)}`,
        url: window.location.origin + `/car/${car.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/car/${car.id}`);
      toast({
        title: "Link copied!",
        description: "Car link copied to clipboard",
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden mb-4 mx-4">
      {/* Image Gallery */}
      <div className="relative aspect-[4/3]">
        <Link to={`/car/${car.id}`}>
          <img
            src={car.images[currentImageIndex]}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        </Link>
        
        {/* Navigation arrows */}
        {car.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Image indicators */}
        {car.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
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

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {car.featured && (
            <Badge className="bg-amber-500/90 text-white text-xs px-2 py-1">
              ⭐ Featured
            </Badge>
          )}
          {car.verified && (
            <Badge className="bg-green-500/90 text-white text-xs px-2 py-1">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {car.isRentAvailable && (
            <Badge className="bg-blue-500/90 text-white text-xs px-2 py-1">
              Rent ₹{car.rentPrice?.daily.toLocaleString('en-IN')}/day
            </Badge>
          )}
        </div>

        {/* Heart and Share buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className={`h-10 w-10 p-0 shadow-lg rounded-full ${
              isSaved ? 'bg-red-50 hover:bg-red-100' : 'bg-white/90 hover:bg-white'
            }`}
            onClick={handleSave}
          >
            <Heart className={`h-4 w-4 ${
              isSaved ? 'text-red-500 fill-current' : 'text-gray-600'
            }`} />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-10 w-10 p-0 shadow-lg rounded-full bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title and Price */}
        <div>
          <Link to={`/car/${car.id}`}>
            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
              {car.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-primary">
              {formatPrice(car.price)}
            </p>
            {car.isRentAvailable && car.rentPrice && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Rent from</p>
                <p className="text-sm font-bold text-secondary">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{car.year}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Settings className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{car.transmission}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Fuel className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{car.fuelType}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">{car.mileage.toLocaleString('en-IN')} km</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium">{car.location}</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {car.seller.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{car.seller.name}</p>
              {car.seller.verified && (
                <Badge className="bg-success/10 text-success border-success/20 text-xs px-2 py-0.5">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            {car.seller.rating > 0 && (
              <div className="flex items-center text-xs text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < car.seller.rating ? 'fill-current' : ''}`} />
                ))}
                <span className="font-medium ml-1 text-foreground">{car.seller.rating}.0</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button 
            className="w-full h-12 premium-gradient font-semibold text-white text-base"
            onClick={onMakeOffer}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Make an Offer
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-11 font-medium"
              onClick={onChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button 
              variant="outline" 
              className="h-11 font-medium"
              onClick={onTestDrive}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Test Drive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCarCard;
