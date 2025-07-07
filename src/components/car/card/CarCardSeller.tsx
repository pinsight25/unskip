
import { Shield, Star, Clock } from 'lucide-react';
import { Car } from '@/types/car';

interface CarCardSellerProps {
  seller: Car['seller'];
}

const CarCardSeller = ({ seller }: CarCardSellerProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md space-y-2 mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-orange-600">
            {seller.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm text-gray-900 truncate">{seller.name}</p>
            {seller.verified && (
              <Shield className="h-3 w-3 text-green-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            {seller.rating > 0 && (
              <div className="flex items-center text-amber-500">
                <Star className="h-3 w-3 fill-current mr-1" />
                <span className="font-medium">{seller.rating}.0</span>
              </div>
            )}
            <div className="flex items-center text-green-600">
              <Clock className="h-3 w-3 mr-1" />
              <span className="font-medium">Active 2h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardSeller;
