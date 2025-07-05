
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
    <div className="flex items-center justify-between">
      <p className="text-xl font-bold text-orange-500">
        {formatPrice(car.price)}
      </p>
      {car.isRentAvailable && car.rentPrice && (
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">Rent Available</p>
          <p className="text-sm font-semibold text-green-600">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
        </div>
      )}
    </div>
  );
};

export default CarCardPrice;
