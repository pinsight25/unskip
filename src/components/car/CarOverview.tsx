
import { formatIndianPrice } from '@/utils/priceFormatter';

interface CarOverviewProps {
  title: string;
  price: number;
  rentPrice?: {
    daily: number;
    weekly: number;
  };
  description: string;
}

const CarOverview = ({ title, price, rentPrice, description }: CarOverviewProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-primary">{formatIndianPrice(price)}</span>
          {rentPrice && (
            <span className="text-sm text-gray-500">
              or ₹{rentPrice.daily.toLocaleString()}/day
            </span>
          )}
        </div>
      </div>
      
      <div>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default CarOverview;
