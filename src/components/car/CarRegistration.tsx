
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MapPin, Calendar } from 'lucide-react';

interface CarRegistrationProps {
  registrationYear?: number;
  registrationState?: string;
  year: number;
  variant?: string;
  seatingCapacity?: number;
}

const CarRegistration = ({ 
  registrationYear, 
  registrationState, 
  year,
  variant,
  seatingCapacity 
}: CarRegistrationProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          Registration & Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Registration Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Model Year:</span>
              <span className="font-medium">{year}</span>
            </div>
            
            {registrationYear && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Registration:</span>
                <span className="font-medium">{registrationYear}</span>
              </div>
            )}
            
            {registrationState && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">State:</span>
                <Badge variant="outline" className="text-xs">
                  {registrationState}
                </Badge>
              </div>
            )}
            
            {seatingCapacity && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Seating:</span>
                <span className="font-medium">{seatingCapacity} Seater</span>
              </div>
            )}
          </div>
        </div>

        {/* Variant */}
        {variant && (
          <div>
            <span className="text-sm text-gray-600">Variant: </span>
            <Badge variant="secondary" className="text-sm">
              {variant}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarRegistration;
