
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MapPin } from 'lucide-react';
import { Accessory } from '@/types/accessory';

interface AccessoryCardProps {
  accessory: Accessory;
  viewMode?: 'grid' | 'list';
}

const AccessoryCard = ({ accessory, viewMode = 'grid' }: AccessoryCardProps) => {
  const formatPrice = (priceMin: number, priceMax?: number | null) => {
    if (!priceMax || priceMin === priceMax) {
      return `₹${priceMin.toLocaleString('en-IN')}`;
    }
    return `₹${priceMin.toLocaleString('en-IN')} - ₹${priceMax.toLocaleString('en-IN')}`;
  };

  // Use real images from accessory data, fallback to placeholder if none
  const imageUrl = accessory.images && accessory.images.length > 0 
    ? accessory.images[0] 
    : 'https://via.placeholder.com/300x300?text=Accessory';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <Link to={`/accessories/${accessory.id}`}>
          <div className="aspect-square mb-3 overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={accessory.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          
          <div className="space-y-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              <Badge className="bg-green-500 text-white text-xs">New</Badge>
              {accessory.featured && (
                <Badge className="bg-amber-500 text-white text-xs">Featured</Badge>
              )}
              {accessory.verified_seller && (
                <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
              )}
            </div>

            {/* Title and Brand */}
            <div>
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {accessory.name}
              </h3>
              <p className="text-xs text-gray-600">{accessory.brand}</p>
            </div>

            {/* Price */}
            <p className="font-bold text-primary">
              {formatPrice(accessory.price_min, accessory.price_max)}
            </p>

            {/* Compatibility */}
            {accessory.compatibility && accessory.compatibility.length > 0 && (
              <p className="text-xs text-gray-600">
                Fits: {accessory.compatibility.slice(0, 3).join(', ')}
                {accessory.compatibility.length > 3 && ` +${accessory.compatibility.length - 3} more`}
              </p>
            )}

            {/* Location */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {accessory.location}
              </div>
              {accessory.views && (
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {accessory.views}
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `/accessories/${accessory.id}`;
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccessoryCard;
