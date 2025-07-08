
import { Calendar, Fuel, Settings, Gauge } from 'lucide-react';
import { formatMileage } from '@/utils/carHelpers';

interface BasicSpecsProps {
  year: number;
  fuelType: string;
  transmission: string;
  mileage: number;
}

const BasicSpecs = ({ year, fuelType, transmission, mileage }: BasicSpecsProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Specifications</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{year}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Fuel className="h-4 w-4 text-gray-500" />
          <span>{fuelType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4 text-gray-500" />
          <span>{transmission}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Gauge className="h-4 w-4 text-gray-500" />
          <span>{formatMileage(mileage)}</span>
        </div>
      </div>
    </div>
  );
};

export default BasicSpecs;
