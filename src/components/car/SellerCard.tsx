
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { Seller } from '@/types/car';

interface SellerCardProps {
  seller: Seller;
}

const SellerCard = ({ seller }: SellerCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {seller.name.charAt(0)}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold">{seller.name}</h3>
              {seller.verified && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Member since {seller.memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerCard;
