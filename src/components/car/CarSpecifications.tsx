
import { Calendar, Settings, Fuel, MapPin, Users, Star, Gauge, Palette } from 'lucide-react';

interface CarSpecificationsProps {
  year: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  color?: string;
  location: string;
  landmark?: string;
  seller: {
    rating?: number;
  };
}

const CarSpecifications = ({ 
  year, 
  transmission, 
  fuelType, 
  mileage, 
  color,
  location, 
  landmark,
  seller 
}: CarSpecificationsProps) => {
  const displayLocation = landmark ? `${location}, ${landmark}` : location;
  
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
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
          <Gauge className="h-4 w-4" />
          <span>{(mileage/1000).toFixed(0)}k km</span>
        </div>
        {color && (
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span>{color}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>5 Seats</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{displayLocation}</span>
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

export default CarSpecifications;
