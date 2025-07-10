
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, Shield, MapPin, Clock, Mail } from 'lucide-react';
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
  onCall,
  email,
  whatsappContact 
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

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={onChat} className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Seller
          </Button>
          <Button onClick={onCall} variant="outline" className="w-full">
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
          {whatsappContact && (
            <Button variant="outline" className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.592-.487-.512-.669-.512-.173-.003-.371-.03-.57-.03-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382z"/>
              </svg>
              WhatsApp Available
            </Button>
          )}
        </div>

        {/* Seller Stats */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{seller.totalSales}</p>
              <p className="text-xs text-gray-500">Sales</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Since {new Date(seller.memberSince).getFullYear()}
              </p>
              <p className="text-xs text-gray-500">Member</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessorySellerCard;
