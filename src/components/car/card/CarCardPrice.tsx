
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
          <Badge variant="secondary" className="text-xs whitespace-nowrap px-2 py-1">
            Also for rent
          </Badge>
        )}
      </div>
      {car.isRentAvailable && car.rentPrice && (
        <div className="text-right">
          <p className="small-text font-semibold text-green-600">
            ₹{car.rentPrice.daily.toLocaleString('en-IN')}/day
          </p>
        </div>
      )}
    </div>
  );
};

export default CarCardPrice;
