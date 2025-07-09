
import { Calendar, Fuel, Settings, Gauge, Palette, Users } from 'lucide-react';
import { formatMileage } from '@/utils/carHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicSpecsProps {
  year: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color?: string;
  seatingCapacity?: number;
}

const BasicSpecs = ({ 
  year, 
  fuelType, 
  transmission, 
  mileage, 
  color,
  seatingCapacity 
}: BasicSpecsProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Year</div>
              <div className="font-medium">{year}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Fuel</div>
              <div className="font-medium">{fuelType}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Transmission</div>
              <div className="font-medium">{transmission}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Mileage</div>
              <div className="font-medium">{formatMileage(mileage)}</div>
            </div>
          </div>
          
          {color && (
            <div className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-gray-600">Color</div>
                <div className="font-medium">{color}</div>
              </div>
            </div>
          )}
          
          {seatingCapacity && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-gray-600">Seating</div>
                <div className="font-medium">{seatingCapacity} Seater</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicSpecs;
