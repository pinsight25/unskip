
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface CarConditionProps {
  noAccidentHistory?: boolean;
  acceptOffers?: boolean;
  offerPercentage?: number;
  insuranceValid?: boolean;
  insuranceValidTill?: string;
  insuranceType?: 'Comprehensive' | 'Third Party';
  lastServiceDate?: string;
  serviceAtAuthorized?: boolean;
  rtoTransferSupport?: boolean;
}

const CarCondition = ({ 
  noAccidentHistory, 
  acceptOffers, 
  offerPercentage,
  insuranceValid,
  insuranceValidTill,
  insuranceType,
  lastServiceDate,
  serviceAtAuthorized,
  rtoTransferSupport 
}: CarConditionProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric' 
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Condition & History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Accident History */}
        <div className="flex items-center gap-2">
          {noAccidentHistory ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-700">No Accident History</span>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                Clean Record
              </Badge>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-700">Accident history available</span>
            </>
          )}
        </div>

        {/* Service History */}
        {(lastServiceDate || serviceAtAuthorized !== undefined) && (
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm text-purple-800">Service History</span>
            </div>
            <div className="space-y-1 text-sm text-purple-700">
              {lastServiceDate && (
                <p>Last Service: {formatDate(lastServiceDate)}</p>
              )}
              {serviceAtAuthorized !== undefined && (
                <p>Service Center: {serviceAtAuthorized ? 'Authorized' : 'Local'}</p>
              )}
            </div>
          </div>
        )}

        {/* Insurance */}
        {(insuranceValid && insuranceValidTill && insuranceType) && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-800">Insurance Details</span>
            </div>
            <div className="space-y-1 text-sm text-blue-700">
              <p>Type: {insuranceType}</p>
              <p>Valid until: {formatDate(insuranceValidTill)}</p>
            </div>
          </div>
        )}

        {/* Offers */}
        {acceptOffers && offerPercentage && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm text-green-800">
                Accepting offers from {offerPercentage}% of asking price
              </span>
            </div>
          </div>
        )}

        {/* RTO Transfer */}
        {rtoTransferSupport && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">RC Transfer Support Available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarCondition;
