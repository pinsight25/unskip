
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
  const formatPrice = (price: { min: number; max: number }) => {
    if (price.min === price.max) {
      return `₹${price.min.toLocaleString('en-IN')}`;
    }
    return `₹${price.min.toLocaleString('en-IN')} - ₹${price.max.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <Link to={`/accessories/${accessory.id}`}>
          <div className="aspect-square mb-3 overflow-hidden rounded-lg">
            <img
              src={accessory.images[0]}
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
              {formatPrice(accessory.price)}
            </p>

            {/* Compatibility */}
            <p className="text-xs text-gray-600">
              Fits: {accessory.compatibility.slice(0, 3).join(', ')}
              {accessory.compatibility.length > 3 && ` +${accessory.compatibility.length - 3} more`}
            </p>

            {/* Location */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {accessory.location}
              </div>
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
