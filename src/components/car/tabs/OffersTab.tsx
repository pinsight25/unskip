
import { CheckCircle, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from '@/types/car';

interface OffersTabProps {
  car: Car;
}

const OffersTab = ({ car }: OffersTabProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        {car.acceptOffers && car.offerPercentage ? (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm text-green-800">
                Accepting offers from {car.offerPercentage}% of asking price
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Percent className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No offers accepted</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OffersTab;
