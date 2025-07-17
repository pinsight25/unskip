
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ShareButton from '@/components/ui/ShareButton';
import { 
  MapPin, 
  Car as CarIcon, 
  Phone, 
  Shield, 
  Calendar, 
  Building, 
  User, 
  Mail,
  Award
} from 'lucide-react';

interface DealerHeaderProps {
  dealer: {
    id: string;
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    businessCategory?: string;
    specialization?: string;
    location: string;
    establishmentYear?: string;
    carsInStock: number;
    verified: boolean;
    brands: string[];
    shopPhoto?: string;
    shop_photos_urls?: string[];
    about?: string;
    shop_address?: string;
    city?: string;
    brands_deal_with?: string[];
    slug?: string; // Added slug to the interface
  };
}

const DealerHeader = ({ dealer }: DealerHeaderProps) => {
  const handleCallNow = () => {
    const phoneNumber = dealer.phone || '+919876543210';
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleGetDirections = () => {
    const encodedLocation = encodeURIComponent(dealer.location);
    window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
  };

  const getSpecializationColor = (specialization: string) => {
    switch (specialization) {
      case 'Luxury Cars':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Budget Cars':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'Electric':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  // Shop photos logic
  const shopPhotos = dealer.shop_photos_urls || [];
  const coverPhoto = shopPhotos[0] || 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=800&h=300&fit=crop';
  const galleryPhotos = shopPhotos.slice(1, 3);

  // Brands logic
  const brands = dealer.brands_deal_with || dealer.brands || [];
  // Location logic
  const location = dealer.shop_address || dealer.city || '';

  return (
    <div className="space-y-4">
      {/* Hero Banner with Shop Photo */}
      <div className="relative h-48 md:h-56 rounded-xl overflow-hidden mx-4 md:mx-0 shadow-lg">
        <img
          src={coverPhoto}
          alt={`${dealer.name} shop`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        {/* Gallery Thumbnails */}
        {galleryPhotos.length > 0 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {galleryPhotos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Shop photo ${idx + 2}`}
                className="w-14 h-14 object-cover rounded-lg border-2 border-white shadow-md"
              />
            ))}
          </div>
        )}
        {/* Overlay Content */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl md:text-2xl font-bold">{dealer.name}</h1>
                {dealer.verified && (
                  <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0 text-xs px-2 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            
            <ShareButton 
              dealerName={dealer.name}
              dealerSlug={dealer.slug}
              carsCount={dealer.carsInStock}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            />
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 md:mx-0">
        {/* About Card */}
        <Card className="shadow-md border-0 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Building className="h-4 w-4 text-primary mr-2" />
              <h3 className="font-semibold text-base">About</h3>
            </div>
            <div className="space-y-2">
              {dealer.establishmentYear && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-2 text-gray-500" />
                  <span className="text-sm">Since {dealer.establishmentYear}</span>
                </div>
              )}
              {dealer.businessCategory && (
                <div className="flex items-center">
                  <Award className="h-3 w-3 mr-2 text-gray-500" />
                  <span className="text-sm">{dealer.businessCategory}</span>
                </div>
              )}
              {dealer.about && (
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-700">{dealer.about}</span>
                </div>
              )}
            </div>
            
            {dealer.specialization && (
              <div className="mt-3">
                <Badge className={`${getSpecializationColor(dealer.specialization)} border font-medium text-xs px-2 py-1`}>
                  {dealer.specialization}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="shadow-md border-0 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <User className="h-4 w-4 text-primary mr-2" />
              <h3 className="font-semibold text-base">Contact</h3>
            </div>
            <div className="space-y-2">
              {dealer.contactPerson && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">{dealer.contactPerson}</span>
                </div>
              )}
              {dealer.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2 text-gray-500" />
                  <span className="text-sm">{dealer.phone}</span>
                </div>
              )}
              {dealer.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2 text-gray-500" />
                  <span className="text-sm">{dealer.email}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                className="flex-1 text-sm py-1"
                onClick={handleCallNow}
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Location & Inventory Card */}
        <Card className="shadow-md border-0 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <MapPin className="h-4 w-4 text-primary mr-2" />
              <h3 className="font-semibold text-base">Location & Stock</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-3 w-3 mr-2 text-gray-500 mt-0.5" />
                <span className="text-sm">{location || 'Location not set'}</span>
              </div>
              <div className="flex items-center">
                <CarIcon className="h-3 w-3 mr-2 text-gray-500" />
                <span className="text-sm">
                  {dealer.carsInStock === 0 ? 'No cars' : `${dealer.carsInStock}+ cars`} in stock
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 text-sm py-1"
              onClick={handleGetDirections}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Get Directions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Brands Section */}
      <Card className="shadow-md border-0 mx-4 md:mx-0">
        <CardContent className="p-4">
          <h3 className="font-semibold text-base mb-3 flex items-center">
            <Award className="h-4 w-4 text-primary mr-2" />
            Brands Available
          </h3>
          <div className="flex flex-wrap gap-2">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <Badge 
                  key={brand} 
                  variant="outline" 
                  className="px-2 py-1 text-sm font-medium hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {brand}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">No brands set</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerHeader;
