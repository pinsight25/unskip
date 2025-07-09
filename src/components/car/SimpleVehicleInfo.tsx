
import LocationDisplay from '@/components/shared/LocationDisplay';
import { getOwnershipText, formatKilometersDriven } from '@/utils/carHelpers';

interface SimpleVehicleInfoProps {
  ownership: number;
  year: number;
  mileage: number;
  location: string;
  landmark?: string;
  insuranceValid?: boolean;
  insuranceValidTill?: string;
  insuranceType?: 'Comprehensive' | 'Third Party';
  lastServiceDate?: string;
  serviceAtAuthorized?: boolean;
}

const SimpleVehicleInfo = ({
  ownership,
  year,
  mileage,
  location,
  landmark,
  insuranceValid,
  insuranceValidTill,
  insuranceType,
  lastServiceDate,
  serviceAtAuthorized
}: SimpleVehicleInfoProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="font-medium text-green-700">{getOwnershipText(ownership)}</span>
        <span className="text-gray-400">•</span>
        <span>{year}</span>
        <span className="text-gray-400">•</span>
        <span>{formatKilometersDriven(mileage)}</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-green-600">
        {insuranceValid && (
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Insurance Valid</span>
          </div>
        )}
        {(lastServiceDate || serviceAtAuthorized !== undefined) && (
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
