
import { Calendar, Settings, Fuel, MapPin, Star } from 'lucide-react';

interface MobileCarDetailsProps {
  year: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  location: string;
  seller: {
    rating?: number;
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
    <>
      {/* Car Details */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{year}</span>
        </div>
        <div className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>{transmission}</span>
        </div>
        <div className="flex items-center gap-1">
          <Fuel className="h-4 w-4" />
          <span>{fuelType}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">{mileage.toLocaleString()} km</span>
        </div>
      </div>

      {/* Location and Seller */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            {seller.rating && (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-medium">{seller.rating}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileCarDetails;
