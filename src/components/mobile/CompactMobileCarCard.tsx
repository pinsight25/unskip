
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Award, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactMobileCarCardProps {
  car: any;
  onSave: (carId: string) => void;
  isSaved: boolean;
  onMakeOffer: () => void;
}

const CompactMobileCarCard = ({ 
  car, 
  onSave, 
  isSaved, 
  onMakeOffer
}: CompactMobileCarCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(car.id);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const calculateEMI = (price: number) => {
    // Simple EMI calculation for demonstration
    const emi = Math.round(price * 0.02);
    return `₹${emi.toLocaleString()}/m*`;
  };

  const formatMileage = (mileage: number) => {
    if (mileage >= 1000) {
      return `${Math.round(mileage / 1000)}k km`;
    }
    return `${mileage} km`;
  };

  return (
    <Card className="overflow-hidden cursor-pointer mb-3 hover:shadow-md transition-shadow" onClick={handleCardClick}>
      {/* Image Section - Reduced height */}
      <div className="relative aspect-[4/2.5] overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-full object-cover"
        />
        
        {/* Heart Button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>

        {/* Badges - Smaller and repositioned */}
        <div className="absolute top-2 left-2 flex gap-1">
          {car.featured && (
            <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 h-5">
              <Award className="h-2.5 w-2.5 mr-1" />
              Featured
            </Badge>
          )}
          {car.verified && (
            <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 h-5">
              <Shield className="h-2.5 w-2.5 mr-1" />
              Verified
            </Badge>
          )}
          {car.isRentAvailable && (
            <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 h-5">
              Rent Available
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section - More compact */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-1 text-gray-900">
          {car.year} {car.title}
        </h3>

        {/* Price and EMI */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(car.price)}
          </span>
          <span className="text-xs text-gray-500">
            EMI {calculateEMI(car.price)}
          </span>
        </div>

        {/* Single Row Specs */}
        <div className="text-xs text-gray-600">
          {formatMileage(car.mileage)} • {car.fuelType} • {car.transmission} • {car.location.split(',')[0]}
        </div>

        {/* Seller Info - Single Line */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-700">
            <span className="font-medium">{car.seller.name}</span>
            <span className="text-gray-500">•</span>
            <span>{car.seller.type === 'dealer' ? car.seller.businessName || 'Dealer' : 'Individual'}</span>
          </div>
          {car.seller.rating && (
            <span className="text-gray-600 font-medium">
              {car.seller.rating}★
            </span>
          )}
        </div>

        {/* Action Button - Compact */}
        <Button 
          size="sm"
          className="w-full h-8 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onMakeOffer();
          }}
        >
          Make an Offer
        </Button>
      </div>
    </Card>
  );
};

export default CompactMobileCarCard;
