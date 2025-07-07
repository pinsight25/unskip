
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';

interface CarCardPriceProps {
  car: Car;
}

const CarCardPrice = ({ car }: CarCardPriceProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-2xl font-bold text-primary">
          {formatPrice(car.price)}
        </p>
        {car.isRentAvailable && car.rentPrice && (
          <Badge 
            variant="outline" 
            className="bg-teal-50 text-teal-700 border-teal-200 text-xs px-2 py-1 font-medium"
          >
            Also for rent
          </Badge>
        )}
      </div>
      {car.isRentAvailable && car.rentPrice && (
        <div className="mt-1">
          <p className="text-sm font-semibold text-teal-600">
            ₹{car.rentPrice.daily.toLocaleString('en-IN')}/day
          </p>
        </div>
      )}
    </div>
  );
};

export default CarCardPrice;
