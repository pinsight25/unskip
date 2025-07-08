
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Heart, MessageCircle, Shield } from 'lucide-react';
import { Accessory } from '@/types/accessory';
import { useToast } from '@/hooks/use-toast';

interface AccessoryCardProps {
  accessory: Accessory;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

const AccessoryCard = ({ accessory, onSave, isSaved = false }: AccessoryCardProps) => {
  const { toast } = useToast();

  const formatPrice = (price: { min: number; max: number }) => {
    if (price.min === price.max) {
      return `₹${price.min.toLocaleString('en-IN')}`;
    }
    return `₹${price.min.toLocaleString('en-IN')} - ₹${price.max.toLocaleString('en-IN')}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'bg-green-500 text-white';
      case 'like-new': return 'bg-blue-500 text-white';
      case 'good': return 'bg-yellow-500 text-white';
      case 'fair': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(accessory.id);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Starting Chat",
      description: `Connecting you with ${accessory.seller.shopName}`,
    });
  };

  return (
    <Link to={`/accessories/${accessory.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative">
          <img
            src={accessory.images[0]}
            alt={accessory.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            {accessory.featured && (
              <Badge className="bg-amber-500 text-white text-xs">⭐ Featured</Badge>
            )}
            <Badge className={`text-xs ${getConditionColor('new')}`}>
              New
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white"
            onClick={handleSave}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{accessory.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{accessory.brand}</p>
            
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl font-bold text-primary">
                {formatPrice(accessory.price)}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                {accessory.rating}
              </div>
            </div>
          </div>

          {/* Compatibility Info */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Fits:</p>
            <p className="text-sm font-medium text-gray-700 line-clamp-1">
              {accessory.compatibility.slice(0, 3).join(', ')}
              {accessory.compatibility.length > 3 && ` +${accessory.compatibility.length - 3} more`}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {accessory.location}
            </div>
            {accessory.seller.verified && (
              <div className="flex items-center text-green-600">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </div>
            )}
          </div>

          <Button
            onClick={handleChat}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat with Seller
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AccessoryCard;
