
import { Badge } from '@/components/ui/badge';

interface MobileCarPriceProps {
  price: number;
  rentalRate?: {
    daily: number;
    weekly: number;
    monthly: number;
  } | null;
}

const MobileCarPrice = ({ price, rentalRate }: MobileCarPriceProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-primary">
          {formatPrice(price)}
        </p>
        {rentalRate && (
          <Badge variant="secondary" className="text-xs whitespace-nowrap px-2 py-1">
            Also for rent
          </Badge>
        )}
      </div>
      {rentalRate && (
        <div className="text-right mt-1">
          <p className="text-sm font-semibold text-green-600">
            ₹{rentalRate.daily.toLocaleString('en-IN')}/day
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileCarPrice;
