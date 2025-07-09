
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShareButton from '@/components/ui/ShareButton';
import { MapPin, Car as CarIcon, Phone, Shield } from 'lucide-react';

interface DealerHeaderProps {
  dealer: {
    id: string;
    name: string;
    location: string;
    carsInStock: number;
    responseTime: string;
    verified: boolean;
    brands: string[];
  };
}

const DealerHeader = ({ dealer }: DealerHeaderProps) => {
  const handleCallNow = () => {
    window.location.href = 'tel:+919876543210';
  };

  const handleGetDirections = () => {
    const encodedLocation = encodeURIComponent(dealer.location);
    window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mx-4 md:mx-0 mb-6 p-4 md:p-8 desktop-header-section shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
        <div className="flex-1">
          {/* Mobile: Stack dealer name and badges vertically */}
          <div className="md:flex md:items-center md:gap-3 mb-4 md:mb-6">
            <h1 className="text-xl md:text-4xl font-bold mb-3 md:mb-0">{dealer.name}</h1>
            <div className="flex items-center gap-2">
              {dealer.verified && (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <ShareButton 
                dealerName={dealer.name}
                dealerId={dealer.id}
                carsCount={dealer.carsInStock}
                className="text-xs h-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 text-gray-600 mb-4 md:mb-6">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm md:text-base">{dealer.location}</span>
            </div>
            <div className="flex items-center">
              <CarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm md:text-base">{dealer.carsInStock}+ cars in stock</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm md:text-base">Responds in {dealer.responseTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {dealer.brands.map((brand) => (
              <Badge key={brand} variant="outline" className="text-xs">
                {brand}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons - Full width on mobile, side by side on desktop */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full md:w-auto min-h-[48px]"
            onClick={handleCallNow}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full md:w-auto min-h-[48px]"
            onClick={handleGetDirections}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealerHeader;
