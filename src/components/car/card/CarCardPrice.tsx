
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
    }).format(price).replace('₹', '₹');
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-2xl font-bold text-primary">
        {formatPrice(car.price)}
      </p>
      {car.isRentAvailable && car.rentPrice && (
        <div className="text-right">
          <p className="label-text">Rent Available</p>
          <p className="small-text font-semibold text-green-600">
            ₹{car.rentPrice.daily.toLocaleString('en-IN')}/day
          </p>
        </div>
      )}
    </div>
  );
};

export default CarCardPrice;
