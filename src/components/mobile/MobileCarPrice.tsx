
import { Badge } from '@/components/ui/badge';

interface MobileCarPriceProps {
  price: number;
  rentalRate?: number;
  isRentAvailable?: boolean;
}

const MobileCarPrice = ({ price, rentalRate, isRentAvailable }: MobileCarPriceProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatRental = (rate: number) => {
    return `₹${rate.toLocaleString('en-IN')}/day`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl font-bold text-primary">
          {formatPrice(price)}
        </span>
        {isRentAvailable && rentalRate && (
          <Badge className="bg-teal-500 text-white text-xs px-2 py-1 font-medium">
            Also for rent
          </Badge>
        )}
      </div>
      {isRentAvailable && rentalRate && (
        <div className="mt-1">
          <span className="text-sm font-semibold text-teal-600">
            {formatRental(rentalRate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MobileCarPrice;
