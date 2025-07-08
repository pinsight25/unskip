
import { Crown, Calendar, Shield, FileText, CheckCircle, MapPin } from 'lucide-react';

interface CompactVehicleInfoProps {
  ownership: number;
  registrationYear?: number;
  registrationState?: string;
  insurance?: {
    validTill: string;
    type: 'Comprehensive' | 'Third Party';
  };
  serviceHistory?: {
    lastServiceDate?: string;
    authorizedCenter: boolean;
  };
  rtoTransferSupport: boolean;
  location: string;
  landmark?: string;
}

const CompactVehicleInfo = ({
  ownership,
  registrationYear,
  registrationState,
  insurance,
  serviceHistory,
  rtoTransferSupport,
  location,
  landmark
}: CompactVehicleInfoProps) => {
  const getOwnershipText = (ownership: number) => {
    if (ownership === 1) return '1st Owner';
    if (ownership === 2) return '2nd Owner';
    if (ownership === 3) return '3rd Owner';
    return `${ownership}th Owner`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const displayLocation = landmark ? `${location}, ${landmark}` : location;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Crown className="h-4 w-4 text-orange-500" />
        Vehicle Info
      </h3>
      
      <div className="space-y-2 text-sm">
        {/* Primary info line */}
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-medium text-green-700">{getOwnershipText(ownership)}</span>
          {registrationYear && registrationState && (
            <>
              <span className="text-gray-400">•</span>
              <span>Reg: {registrationYear}, {registrationState}</span>
            </>
          )}
        </div>

        {/* Insurance and service info */}
        <div className="flex flex-wrap items-center gap-2 text-gray-600">
          {insurance && (
            <>
              <Shield className="h-3 w-3 text-blue-500" />
              <span>Insurance valid till {formatDate(insurance.validTill)}</span>
            </>
          )}
          
          {serviceHistory?.lastServiceDate && (
            <>
              <span className="text-gray-400">•</span>
              <span>Last service: {formatDate(serviceHistory.lastServiceDate)}</span>
            </>
          )}
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>Accident free</span>
          </div>
          
          {rtoTransferSupport && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>RC Transfer help</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 pt-1 border-t">
          <MapPin className="h-3 w-3" />
          <span>{displayLocation}</span>
        </div>
      </div>
    </div>
  );
};

export default CompactVehicleInfo;
