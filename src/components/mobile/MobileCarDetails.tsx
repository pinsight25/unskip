
import { Calendar, Gauge, Fuel, MapPin, Shield, Settings } from 'lucide-react';

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
      {/* Car Specs - Improved Mobile Layout */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-md">
            <Calendar className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-md">
            <Gauge className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{(mileage/1000).toFixed(0)}k km</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-md">
            <Fuel className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-md">
            <Settings className="h-3 w-3 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{transmission}</span>
          </div>
        </div>
      </div>

      {/* Location - Better Spacing */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-md">
        <MapPin className="h-3 w-3 text-orange-500 flex-shrink-0" />
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
            {/* Active Time - Better Alignment */}
            <div className="flex items-center gap-3">
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
