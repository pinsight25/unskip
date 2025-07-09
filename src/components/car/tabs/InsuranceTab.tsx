
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from '@/types/car';

interface InsuranceTabProps {
  car: Car;
}

const InsuranceTab = ({ car }: InsuranceTabProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        {(car.insuranceValid && car.insuranceValidTill && car.insuranceType) ? (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm text-blue-800">Insurance Details</span>
            </div>
            <div className="space-y-1 text-sm text-blue-700">
              <p>Type: {car.insuranceType}</p>
              <p>Valid until: {formatDate(car.insuranceValidTill)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No insurance information available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsuranceTab;
