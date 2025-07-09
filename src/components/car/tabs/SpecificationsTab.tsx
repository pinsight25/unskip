
import { Calendar, Fuel, Settings, Gauge, Palette, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatKilometersDriven } from '@/utils/carHelpers';
import { Car } from '@/types/car';

interface SpecificationsTabProps {
  car: Car;
}

const SpecificationsTab = ({ car }: SpecificationsTabProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Year</div>
              <div className="font-medium">{car.year}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Fuel</div>
              <div className="font-medium">{car.fuelType}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Transmission</div>
              <div className="font-medium">{car.transmission}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Kilometers Driven</div>
              <div className="font-medium">{formatKilometersDriven(car.kilometersDriven)}</div>
            </div>
          </div>
          
          {car.color && (
            <div className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-gray-600">Color</div>
                <div className="font-medium">{car.color}</div>
              </div>
            </div>
          )}
          
          {car.seatingCapacity && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-gray-600">Seating</div>
                <div className="font-medium">{car.seatingCapacity} Seater</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecificationsTab;
