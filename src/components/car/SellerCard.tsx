
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface SellerCardProps {
  seller: {
    id: string;
    name: string;
    rating?: number;
  };
}

const SellerCard = ({ seller }: SellerCardProps) => {
  return (
    <Card className="mb-6">
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-3">Seller Information</h4>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-700 font-semibold">{seller.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium">{seller.name}</p>
            <p className="text-sm text-gray-500">Member since March 2023</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            {seller.rating && (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-medium">{seller.rating}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SellerCard;
