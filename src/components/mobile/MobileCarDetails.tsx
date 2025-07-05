
import { Calendar, Gauge, Fuel, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileCarDetailsProps {
  year: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  location: string;
  seller: {
    name: string;
    type: 'dealer' | 'individual';
    verified: boolean;
    rating?: number;
    activeTime?: string;
  };
}

const MobileCarDetails = ({ 
  year, 
  transmission, 
  fuelType, 
  mileage, 
  location, 
  seller 
}: MobileCarDetailsProps) => {
  return (
    <div className="space-y-3">
      {/* Car Specs */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{year}</span>
        </div>
        <div className="flex items-center gap-1">
          <Gauge className="h-3 w-3" />
          <span>{transmission}</span>
        </div>
        <div className="flex items-center gap-1">
          <Fuel className="h-3 w-3" />
          <span>{fuelType}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{mileage} km/l</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <MapPin className="h-3 w-3" />
        <span>{location}</span>
      </div>

      {/* Seller Info - Fixed Layout */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{seller.name}</span>
            {seller.verified && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700">
                ✓
              </Badge>
            )}
          </div>
          {/* Rating and Active Time - Fixed Alignment */}
          <div className="flex items-center gap-2 mt-1">
            {seller.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700">{seller.rating}</span>
              </div>
            )}
            {seller.activeTime && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500">Active {seller.activeTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCarDetails;
