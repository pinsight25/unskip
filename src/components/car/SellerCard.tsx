
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Shield } from 'lucide-react';
import { Seller } from '@/types/car';

interface SellerCardProps {
  seller: Seller;
}

const SellerCard = ({ seller }: SellerCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-xl font-semibold text-primary">
                {seller.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
              {/* Only show badge if seller.type === 'dealer' and seller.dealerVerified */}
              {seller.type === 'dealer' && seller.dealerVerified && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Dealer
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {seller.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{seller.location}</span>
                </div>
              )}
              {seller.memberSince && seller.memberSince !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Member since {seller.memberSince}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerCard;
