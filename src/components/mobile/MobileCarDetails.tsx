
import { Calendar, Gauge, Fuel, MapPin, Shield, Settings, Eye, Crown } from 'lucide-react';
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
    activeTime?: string;
  };
  seller_type?: 'individual' | 'dealer';
  viewCount?: number;
  ownership?: number;
}

const getOwnershipText = (ownership: number) => {
  if (ownership === 1) return '1st Owner';
  if (ownership === 2) return '2nd Owner';  
  if (ownership === 3) return '3rd Owner';
  return `${ownership}th Owner`;
};

const MobileCarDetails = ({ 
  year, 
  transmission, 
  fuelType, 
  mileage, 
  location, 
  seller,
  seller_type,
  viewCount,
  ownership = 1
}: MobileCarDetailsProps) => {
  return (
    <div className="space-y-4">
      {/* 1st Owner Badge - Buy Cars Style */}
      <Badge className="flex items-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full text-base mb-1 w-fit">
        <Crown className="h-5 w-5 mr-1 text-green-600" />
        {getOwnershipText(ownership)}
      </Badge>

      {/* Car Specs - Improved Mobile Layout */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-base bg-gray-50 px-4 py-3 rounded-xl">
            <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{year}</span>
          </div>
          <div className="flex items-center gap-2 text-base bg-gray-50 px-4 py-3 rounded-xl">
            <Gauge className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{(mileage/1000).toFixed(0)}k km</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-base bg-gray-50 px-4 py-3 rounded-xl">
            <Fuel className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-base bg-gray-50 px-4 py-3 rounded-xl">
            <Settings className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">{transmission}</span>
          </div>
        </div>
      </div>

      {/* Location and Views - Aligned */}
      <div className="flex items-center justify-between text-base text-gray-600 bg-orange-50 px-4 py-3 rounded-xl">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span className="font-medium">{location}</span>
        </div>
        {viewCount !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{viewCount}</span>
          </div>
        )}
      </div>

      {/* Seller Info - Plain Text Below Location, Same Line */}
      <div className="flex items-center gap-2 mt-1 ml-1">
        <span className="text-base font-semibold text-gray-900">{seller.name}</span>
        {seller_type === 'dealer' && (
          <span className="text-base font-semibold text-green-700 ml-1">Dealer</span>
        )}
      </div>
    </div>
  );
};

export default MobileCarDetails;
