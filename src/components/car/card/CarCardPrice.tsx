
import { Car } from '@/types/car';

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
      <p className="text-2xl font-bold text-primary mb-2">
        {formatPrice(car.price)}
      </p>
      {car.isRentAvailable && car.rentPrice && (
        <p className="text-sm font-semibold text-teal-600">
          ₹{car.rentPrice.daily.toLocaleString('en-IN')}/day
        </p>
      )}
    </div>
  );
};

export default CarCardPrice;
