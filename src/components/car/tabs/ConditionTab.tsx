
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';

interface ConditionTabProps {
  car: Car;
}

const ConditionTab = ({ car }: ConditionTabProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Accident History */}
        <div className="flex items-center gap-2">
          {car.noAccidentHistory ? (
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
        {(car.lastServiceDate || car.serviceAtAuthorized !== undefined) && (
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-sm text-purple-800">Service History</span>
            </div>
            <div className="space-y-1 text-sm text-purple-700">
              {car.lastServiceDate && (
                <p>Last Service: {formatDate(car.lastServiceDate)}</p>
              )}
              {car.serviceAtAuthorized !== undefined && (
                <p>Service Center: {car.serviceAtAuthorized ? 'Authorized' : 'Local'}</p>
              )}
            </div>
          </div>
        )}

        {/* RTO Transfer */}
        {car.rtoTransferSupport && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">RC Transfer Support Available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConditionTab;
