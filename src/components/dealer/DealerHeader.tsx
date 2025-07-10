
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
  Star,
  Award,
  Clock
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
    responseTime: string;
    verified: boolean;
    brands: string[];
    shopPhoto?: string;
    rating?: number;
    reviewCount?: number;
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

  // Mock shop photo for demonstration
  const shopPhoto = dealer.shopPhoto || 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=800&h=300&fit=crop';

  return (
    <div className="space-y-6">
      {/* Hero Banner with Shop Photo */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mx-4 md:mx-0 shadow-xl">
        <img
          src={shopPhoto}
          alt={`${dealer.name} shop`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Overlay Content */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-bold">{dealer.name}</h1>
                {dealer.verified && (
                  <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              {dealer.rating && (
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium mr-2">{dealer.rating}</span>
                  <span className="text-sm opacity-90">({dealer.reviewCount} reviews)</span>
                </div>
              )}
            </div>
            
            <ShareButton 
              dealerName={dealer.name}
              dealerId={dealer.id}
              carsCount={dealer.carsInStock}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            />
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-0">
        {/* About Card */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Building className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-lg">About</h3>
            </div>
            <div className="space-y-3">
              {dealer.establishmentYear && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-sm">Since {dealer.establishmentYear}</span>
                </div>
              )}
              {dealer.businessCategory && (
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-sm">{dealer.businessCategory}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-gray-500" />
                <span className="text-sm">Responds in {dealer.responseTime}</span>
              </div>
            </div>
            
            {dealer.specialization && (
              <div className="mt-4">
                <Badge className={`${getSpecializationColor(dealer.specialization)} border font-medium`}>
                  {dealer.specialization}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-lg">Contact</h3>
            </div>
            <div className="space-y-3">
              {dealer.contactPerson && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-sm font-medium">{dealer.contactPerson}</span>
                </div>
              )}
              {dealer.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-sm">{dealer.phone}</span>
                </div>
              )}
              {dealer.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-500" />
                  <span className="text-sm">{dealer.email}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={handleCallNow}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Location & Inventory Card */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold text-lg">Location & Stock</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-gray-500 mt-0.5" />
                <span className="text-sm">{dealer.location}</span>
              </div>
              <div className="flex items-center">
                <CarIcon className="h-4 w-4 mr-3 text-gray-500" />
                <span className="text-sm">
                  {dealer.carsInStock === 0 ? 'No cars' : `${dealer.carsInStock}+ cars`} in stock
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={handleGetDirections}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Get Directions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Brands Section */}
      <Card className="shadow-lg border-0 mx-4 md:mx-0">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <Award className="h-5 w-5 text-primary mr-2" />
            Brands Available
          </h3>
          <div className="flex flex-wrap gap-2">
            {dealer.brands.map((brand) => (
              <Badge 
                key={brand} 
                variant="outline" 
                className="px-3 py-1 text-sm font-medium hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                {brand}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerHeader;
