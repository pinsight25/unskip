
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { AccessorySeller } from '@/types/accessory';

interface AccessorySellerCardProps {
  seller: AccessorySeller;
}

const AccessorySellerCard = ({ seller }: AccessorySellerCardProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {seller.shopName.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-lg">{seller.shopName}</h4>
              <p className="text-gray-600">{seller.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {seller.location}
                </div>
                <div>
                  {seller.totalSales} sales
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessorySellerCard;
