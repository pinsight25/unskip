
import LocationDisplay from '@/components/shared/LocationDisplay';
import { getOwnershipText, formatMileage } from '@/utils/carHelpers';

interface SimpleVehicleInfoProps {
  ownership: number;
  year: number;
  mileage: number;
  location: string;
  landmark?: string;
  insurance?: {
    validTill: string;
    type: 'Comprehensive' | 'Third Party';
  };
  serviceHistory?: {
    lastServiceDate?: string;
    authorizedCenter: boolean;
  };
}

const SimpleVehicleInfo = ({
  ownership,
  year,
  mileage,
  location,
  landmark,
  insurance,
  serviceHistory
}: SimpleVehicleInfoProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="font-medium text-green-700">{getOwnershipText(ownership)}</span>
        <span className="text-gray-400">•</span>
        <span>{year}</span>
        <span className="text-gray-400">•</span>
        <span>{formatMileage(mileage)}</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-green-600">
        {insurance && (
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Insurance Valid</span>
          </div>
        )}
        {serviceHistory && (
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Complete Service History</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t">
        <LocationDisplay 
          location={location} 
          landmark={landmark}
          className="text-gray-600"
        />
      </div>
    </div>
  );
};

export default SimpleVehicleInfo;
