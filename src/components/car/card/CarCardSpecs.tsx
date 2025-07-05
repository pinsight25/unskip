
import { Calendar, Fuel, Settings, Gauge, MapPin } from 'lucide-react';
import { Car } from '@/types/car';

interface CarCardSpecsProps {
  car: Car;
}

const CarCardSpecs = ({ car }: CarCardSpecsProps) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
          <Calendar className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
          <span className="font-medium text-xs">{car.year}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
          <Gauge className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
          <span className="font-medium text-xs">{(car.mileage/1000).toFixed(0)}k km</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
          <Fuel className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
          <span className="font-medium text-xs">{car.fuelType}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
          <Settings className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
          <span className="font-medium text-xs">{car.transmission}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center text-gray-600 bg-orange-50 px-3 py-2 rounded-md">
        <MapPin className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
        <span className="font-medium text-xs">{car.location}</span>
      </div>
    </div>
  );
};

export default CarCardSpecs;
