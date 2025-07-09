
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Shield } from 'lucide-react';
import { Accessory } from '@/types/accessory';

interface AccessoryInfoProps {
  accessory: Accessory;
  isSaved: boolean;
  onSave: () => void;
  onShare: () => void;
  formatPrice: (price: { min: number; max: number }) => string;
  getConditionColor: (condition: string) => string;
}

const AccessoryInfo = ({ 
  accessory, 
  isSaved, 
  onSave, 
  onShare, 
  formatPrice, 
  getConditionColor 
}: AccessoryInfoProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {accessory.name}
            </h1>
            <p className="text-lg text-gray-600 font-medium">{accessory.brand}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onSave}>
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {accessory.featured && (
            <Badge className="bg-amber-500 text-white">⭐ Featured</Badge>
          )}
          <Badge className={`${getConditionColor('new')}`}>
            New Condition
          </Badge>
          {accessory.seller.verified && (
            <Badge className="bg-green-500 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Verified Seller
            </Badge>
          )}
          <Badge 
            variant={accessory.availability === 'in-stock' ? 'default' : 'secondary'}
            className={accessory.availability === 'in-stock' ? 'bg-green-500 text-white' : ''}
          >
            {accessory.availability === 'in-stock' ? 'In Stock' : 'On Order'}
          </Badge>
          <Badge className="bg-blue-500 text-white">
            Installation Available
          </Badge>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-primary mb-1">
            {formatPrice(accessory.price)}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div>
              {accessory.views} views
            </div>
          </div>
        </div>
      </div>

      {/* Compatible Models - moved from separate section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Compatible Car Models</h3>
        <div className="grid grid-cols-2 gap-2">
          {accessory.compatibility.map((model, index) => (
            <Badge key={index} variant="secondary" className="text-sm justify-center py-2">
              {model}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessoryInfo;
