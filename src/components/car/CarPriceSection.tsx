
import { formatIndianPrice } from '@/utils/priceFormatter';

interface CarPriceSectionProps {
  title: string;
  price: number;
  rentPrice?: {
    daily: number;
    weekly: number;
  };
}

const CarPriceSection = ({ title, price, rentPrice }: CarPriceSectionProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-primary">{formatIndianPrice(price)}</span>
        {rentPrice && (
          <span className="text-sm text-gray-500">
            or ₹{rentPrice.daily.toLocaleString()}/day
          </span>
        )}
      </div>
    </div>
  );
};

export default CarPriceSection;
