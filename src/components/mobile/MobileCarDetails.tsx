
import { Calendar, Gauge, Fuel, MapPin, Star, Shield } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Car Specs - Better Spacing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3 w-3 text-orange-500" />
            <span className="font-medium">{year}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Gauge className="h-3 w-3 text-orange-500" />
            <span className="font-medium">{transmission}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Fuel className="h-3 w-3 text-orange-500" />
            <span className="font-medium">{fuelType}</span>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">{mileage} km/l</span>
          </div>
        </div>
      </div>

      {/* Location - Better Spacing */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-md">
        <MapPin className="h-3 w-3 text-orange-500" />
        <span className="font-medium">{location}</span>
      </div>

      {/* Seller Info - Improved Layout and Spacing */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-orange-600">
              {seller.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900 truncate">{seller.name}</span>
              {seller.verified && (
                <Shield className="h-3 w-3 text-green-600 flex-shrink-0" />
              )}
            </div>
            {/* Rating and Active Time - Better Alignment */}
            <div className="flex items-center gap-3">
              {seller.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">{seller.rating}</span>
                </div>
              )}
              {seller.activeTime && (
                <span className="text-xs text-gray-500">Active {seller.activeTime}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCarDetails;
