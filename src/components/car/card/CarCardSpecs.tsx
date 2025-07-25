
import { Calendar, Fuel, Settings, Gauge, MapPin, Crown } from 'lucide-react';
import { Car } from '@/types/car';

interface CarCardSpecsProps {
  car: Car;
}

const CarCardSpecs = ({ car }: CarCardSpecsProps) => {
  const getOwnershipText = (ownership: number) => {
    if (ownership === 1) return '1st Owner';
    if (ownership === 2) return '2nd Owner';  
    if (ownership === 3) return '3rd Owner';
    return `${ownership}th Owner`;
  };

  return (
    <div className="space-y-3">
      {/* Ownership - Most prominent for Indian buyers */}
      <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
        <div className="flex items-center text-green-700">
          <Crown className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
          <span className="small-text font-semibold">{getOwnershipText(car.ownership)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-gap">
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Calendar className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          <span className="small-text font-medium">{car.year}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Gauge className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          <span className="small-text font-medium">{(car.mileage/1000).toFixed(0)}k km</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 grid-gap">
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Fuel className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          <span className="small-text font-medium">{car.fuelType}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Settings className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          <span className="small-text font-medium">{car.transmission}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center text-gray-600 bg-orange-50 px-3 py-2 rounded-lg">
        <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
        <span className="small-text font-medium">{car.location}</span>
      </div>
    </div>
  );
};

export default CarCardSpecs;
