
import { Star, Shield } from 'lucide-react';
import { Seller } from '@/types/car';

interface CarCardSellerProps {
  seller: Seller;
}

const CarCardSeller = ({ seller }: CarCardSellerProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {seller.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <span className="small-text font-medium line-clamp-1">{seller.name}</span>
            {seller.verified && (
              <Shield className="h-3 w-3 text-green-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{seller.rating}</span>
            </div>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">
              {seller.type === 'dealer' ? 'Dealer' : 'Individual'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardSeller;
