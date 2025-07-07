
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accessory } from '@/types/accessory';
import { Heart, MessageCircle, Phone } from 'lucide-react';
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

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${accessory.seller.phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi, I'm interested in your ${accessory.name} listed on Unskip`;
    const whatsappUrl = `https://wa.me/${accessory.seller.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-0">
          <Link to={`/accessories/${accessory.id}`} className="flex flex-col md:flex-row h-full">
            {/* Image */}
            <div className="md:w-1/3 aspect-square md:aspect-[4/3] relative overflow-hidden">
              <img
                src={accessory.images[0]}
                alt={accessory.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="heading-4 line-clamp-2">{accessory.name}</h3>
                    <p className="text-sm text-gray-600 font-medium mt-1">{accessory.brand}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="p-2 h-10 w-10 rounded-full hover:bg-gray-100"
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {accessory.compatibility.slice(0, 3).map((model, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-medium">
                      {model}
                    </Badge>
                  ))}
                  {accessory.compatibility.length > 3 && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      +{accessory.compatibility.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(accessory.price)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{accessory.seller.shopName}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={handleCall} className="px-4">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleWhatsApp} className="px-4">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
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
              className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg"
              onClick={handleSave}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          {/* Title & Brand */}
          <Link to={`/accessories/${accessory.id}`} className="flex-grow">
            <h3 className="heading-4 leading-tight hover:text-primary transition-colors line-clamp-2 mb-2">
              {accessory.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{accessory.brand}</p>
          </Link>

          {/* Price */}
          <div>
            <p className="text-xl font-bold text-primary">
              {formatPrice(accessory.price)}
            </p>
          </div>

          {/* Compatibility Tags */}
          <div className="flex flex-wrap gap-2">
            {accessory.compatibility.slice(0, 2).map((model, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-medium">
                {model}
              </Badge>
            ))}
            {accessory.compatibility.length > 2 && (
              <Badge variant="secondary" className="text-xs font-medium">
                +{accessory.compatibility.length - 2} more
              </Badge>
            )}
          </div>

          {/* Seller Info */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm font-medium truncate">{accessory.seller.shopName}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 h-11 font-medium"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-11 font-medium"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessoryCard;
