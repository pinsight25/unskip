
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';

interface RegistrationTabProps {
  car: Car;
}

const RegistrationTab = ({ car }: RegistrationTabProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric' 
    });
  };

  const formatFCDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Model Year:</span>
              <span className="font-medium">{car.year}</span>
            </div>
            
            {car.registrationYear && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Registration:</span>
                <span className="font-medium">{car.registrationYear}</span>
              </div>
            )}
            
            {car.registrationState && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">State:</span>
                <Badge variant="outline" className="text-xs">
                  {car.registrationState}
                </Badge>
              </div>
            )}
            
            {car.seatingCapacity && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Seating:</span>
                <span className="font-medium">{car.seatingCapacity} Seater</span>
              </div>
            )}

            {/* Fitness Certificate */}
            {car.fitnessCertificateValidTill && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">FC Valid:</span>
                <span className="font-medium">{formatFCDate(car.fitnessCertificateValidTill)}</span>
              </div>
            )}
          </div>

          {car.variant && (
            <div>
              <span className="text-sm text-gray-600">Variant: </span>
              <Badge variant="secondary" className="text-sm">
                {car.variant}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationTab;
