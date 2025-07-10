
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Shield, MapPin, Clock, Mail } from 'lucide-react';
import { AccessorySeller } from '@/types/accessory';

interface AccessorySellerCardProps {
  seller: AccessorySeller;
  onChat: () => void;
  onCall: () => void;
  email?: string;
  whatsappContact?: boolean;
}

const AccessorySellerCard = ({ 
  seller, 
  onChat, 
  email
}: AccessorySellerCardProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {seller.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1">{seller.shopName}</CardTitle>
            <p className="text-sm text-gray-600 mb-2">{seller.name}</p>
            <div className="flex flex-wrap gap-1">
              {seller.verified && (
                <Badge className="bg-green-500 text-white text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {seller.type}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{seller.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Response time: {seller.responseTime}</span>
          </div>
          {email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="truncate">{email}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          <Button onClick={onChat} className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Seller
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessorySellerCard;
