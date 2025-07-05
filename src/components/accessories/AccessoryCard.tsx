
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accessory } from '@/types/accessory';
import { Heart, Star, MapPin, Shield, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessoryCardProps {
  accessory: Accessory;
  viewMode?: 'grid' | 'list';
}

const AccessoryCard = ({ accessory, viewMode = 'grid' }: AccessoryCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: { min: number; max: number }) => {
    if (price.min === price.max) {
      return `₹${price.min.toLocaleString('en-IN')}`;
    }
    return `₹${price.min.toLocaleString('en-IN')} - ₹${price.max.toLocaleString('en-IN')}`;
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Saved!",
      description: isSaved 
        ? "Accessory removed from your saved items" 
        : "Accessory saved to your wishlist",
    });
  };

  const handleGetQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Quote Request Sent!",
      description: "The seller will contact you with pricing details",
    });
  };

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Chat with seller",
      description: "Starting conversation with the seller",
    });
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <Link to={`/accessories/${accessory.id}`} className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 aspect-square md:aspect-video relative">
              <img
                src={accessory.images[0]}
                alt={accessory.name}
                className="w-full h-full object-cover"
              />
              {accessory.featured && (
                <Badge className="absolute top-2 left-2 bg-amber-500 text-white">
                  Featured
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="md:w-2/3 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{accessory.name}</h3>
                    <p className="text-sm text-gray-600">{accessory.brand}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="p-1"
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {accessory.compatibility.slice(0, 3).map((model, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                  {accessory.compatibility.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{accessory.compatibility.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {accessory.rating} ({accessory.reviewCount})
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {accessory.location}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(accessory.price)}
                  </p>
                  <p className="text-sm text-gray-600">{accessory.seller.shopName}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleChat}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" onClick={handleGetQuote}>
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <Link to={`/accessories/${accessory.id}`}>
            <img
              src={accessory.images[0]}
              alt={accessory.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          
          {/* Save Heart Icon */}
          <div className="absolute top-3 right-3">
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-9 w-9 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg"
              onClick={handleSave}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {accessory.featured && (
              <Badge className="bg-amber-500/80 backdrop-blur-sm text-white border-0 font-medium text-xs px-3 py-1 rounded-full shadow-lg">
                ⭐ Featured
              </Badge>
            )}
            {accessory.seller.verified && (
              <Badge className="bg-green-500/80 backdrop-blur-sm text-white border-0 font-medium text-xs px-3 py-1 rounded-full shadow-lg">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg">
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title & Brand */}
          <Link to={`/accessories/${accessory.id}`}>
            <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
              {accessory.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{accessory.brand}</p>
          </Link>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">
              {formatPrice(accessory.price)}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              {accessory.rating}
            </div>
          </div>

          {/* Compatibility */}
          <div className="flex flex-wrap gap-1">
            {accessory.compatibility.slice(0, 2).map((model, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {model}
              </Badge>
            ))}
            {accessory.compatibility.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{accessory.compatibility.length - 2} more
              </Badge>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium">{accessory.seller.shopName}</p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {accessory.location}
              </div>
            </div>
            {accessory.seller.verified && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
              onClick={handleGetQuote}
            >
              Get Quote
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Seller
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessoryCard;
