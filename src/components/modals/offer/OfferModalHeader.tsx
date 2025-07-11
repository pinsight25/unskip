
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { formatIndianPrice } from '@/utils/priceFormatter';

interface OfferModalHeaderProps {
  car: Car;
}

const OfferModalHeader = ({ car }: OfferModalHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 flex items-center space-x-4">
      <img 
        src={car.images[0]} 
        alt={car.title}
        className="w-16 h-16 rounded-xl object-cover"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{car.title}</h3>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xl font-bold text-primary">
            {formatIndianPrice(car.price)}
          </span>
          <Badge variant="outline" className="border-primary/20 bg-primary/5">Asking Price</Badge>
        </div>
      </div>
    </div>
  );
};

export default OfferModalHeader;
