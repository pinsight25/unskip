
import { Shield } from 'lucide-react';
import { Seller } from '@/types/car';

interface CarCardSellerProps {
  seller: Seller;
  seller_type?: 'individual' | 'dealer';
}

const CarCardSeller = ({ seller, seller_type }: CarCardSellerProps) => {
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
            {/* Only show badge if seller_type === 'dealer' and seller.dealerVerified */}
            {seller_type === 'dealer' && seller.dealerVerified && (
              <Shield className="h-3 w-3 text-green-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {seller_type === 'dealer' ? 'Dealer' : 'Owner'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardSeller;
