
import { Calendar, Settings, Fuel, MapPin, Users, Star, Gauge, Palette, Crown, FileText, Shield } from 'lucide-react';

interface CarSpecificationsProps {
  year: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  color?: string;
  location: string;
  landmark?: string;
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
  ownership,
  registrationYear,
  registrationState,
  insurance,
  serviceHistory,
  rtoTransferSupport,
  seller 
}: CarSpecificationsProps) => {
  const displayLocation = landmark ? `${location}, ${landmark}` : location;
  
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
  
  return (
    <>
      {/* Ownership - Most Important for Indian Buyers */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-800">{getOwnershipText(ownership)}</span>
        </div>
      </div>

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

      {/* Registration Details */}
      {(registrationYear || registrationState) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Registration Details</h4>
          <div className="space-y-1 text-sm text-blue-700">
            {registrationYear && <p>Registered: {registrationYear}</p>}
            {registrationState && <p>State: {registrationState}</p>}
          </div>
        </div>
      )}

      {/* Insurance Details */}
      {insurance && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-orange-600" />
            <h4 className="font-medium text-orange-800">Insurance</h4>
          </div>
          <div className="space-y-1 text-sm text-orange-700">
            <p>{insurance.type} - Valid till {formatDate(insurance.validTill)}</p>
          </div>
        </div>
      )}

      {/* Service History */}
      {serviceHistory && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">Service History</h4>
          <div className="space-y-1 text-sm text-purple-700">
            {serviceHistory.lastServiceDate && (
              <p>Last Service: {formatDate(serviceHistory.lastServiceDate)}</p>
            )}
            <p>{serviceHistory.authorizedCenter ? '✓ Authorized Service Center' : 'Local Service Center'}</p>
          </div>
        </div>
      )}

      {/* RTO Transfer Support */}
      {rtoTransferSupport && (
        <div className="mb-4 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">✓ RC Transfer Support Provided</span>
          </div>
        </div>
      )}

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
