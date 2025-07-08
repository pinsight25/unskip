
import { MapPin } from 'lucide-react';

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
  const getOwnershipText = (ownership: number) => {
    if (ownership === 1) return '1st Owner';
    if (ownership === 2) return '2nd Owner';
    if (ownership === 3) return '3rd Owner';
    return `${ownership}th Owner`;
  };

  const displayLocation = landmark ? `${location}, ${landmark}` : location;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="font-medium text-green-700">{getOwnershipText(ownership)}</span>
        <span className="text-gray-400">•</span>
        <span>{year}</span>
        <span className="text-gray-400">•</span>
        <span>{(mileage/1000).toFixed(0)}k km</span>
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

      <div className="flex items-center gap-1 text-gray-600 pt-2 border-t">
        <MapPin className="h-3 w-3" />
        <span className="text-sm">{displayLocation}</span>
      </div>
    </div>
  );
};

export default SimpleVehicleInfo;
