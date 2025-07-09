
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { AccessorySeller } from '@/types/accessory';

interface AccessorySellerCardProps {
  seller: AccessorySeller;
  onChat?: () => void;
  onCall?: () => void;
}

const AccessorySellerCard = ({ seller, onChat, onCall }: AccessorySellerCardProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
        <div className="flex items-start justify-between mb-6">
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
              </div>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        {(onChat || onCall) && (
          <div className="grid grid-cols-2 gap-3">
            {onChat && (
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 text-white font-medium"
                onClick={onChat}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            )}
            {onCall && (
              <Button 
                variant="outline"
                onClick={onCall}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccessorySellerCard;
