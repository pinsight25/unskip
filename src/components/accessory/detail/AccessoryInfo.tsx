
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Shield, CheckCircle, Wrench } from 'lucide-react';
import { Accessory } from '@/types/accessory';

interface AccessoryInfoProps {
  accessory: Accessory;
  onShare: () => void;
  formatPrice: (priceMin: number, priceMax?: number | null) => string;
  getConditionColor: (condition: string) => string;
}

const AccessoryInfo = ({ 
  accessory, 
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
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Streamlined Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {accessory.featured && (
            <Badge className="bg-amber-500 text-white">⭐ Featured</Badge>
          )}
          <Badge className={`${getConditionColor(accessory.condition)}`}>
            {accessory.condition?.charAt(0).toUpperCase() + accessory.condition?.slice(1)} Condition
          </Badge>
          {accessory.verified_seller && (
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
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-primary mb-1">
            {formatPrice(accessory.price_min, accessory.price_max)}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div>
              {accessory.views || 0} views
            </div>
          </div>
        </div>

        {/* Warranty and Installation Information */}
        <div className="mb-4 space-y-2">
          {/* Warranty */}
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium">Warranty:</span>
            <span className="text-gray-700">
              {accessory.warranty ? `${accessory.warranty}` : 'No Warranty'}
            </span>
          </div>

          {/* Installation Service */}
          {accessory.installation_available && (
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="h-4 w-4 text-blue-500" />
              <span className="text-green-600 font-medium">✓ Installation Service Available</span>
            </div>
          )}
        </div>

        {/* Compatible Models - Below Pricing */}
        {accessory.compatibility && accessory.compatibility.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Compatible with:</p>
            <div className="text-sm">
              {accessory.compatibility.slice(0, 4).map((model, index) => (
                <span key={model}>
                  <span className="text-cyan-600 font-medium">{model}</span>
                  {index < Math.min(accessory.compatibility.length, 4) - 1 && ', '}
                </span>
              ))}
              {accessory.compatibility.length > 4 && (
                <span className="text-gray-500"> +{accessory.compatibility.length - 4} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoryInfo;
