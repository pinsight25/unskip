import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Car, Clock, Eye, Edit, Trash2, Copy, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  views: number;
  postedDate: string;
  status: string;
  // Add all the fields we need for duplication
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  registrationYear?: number;
  registrationState?: string;
  fitnessCertificateValidTill?: string;
  numberOfOwners?: string;
  seatingCapacity?: string;
  fuelType?: string;
  transmission?: string;
  kilometersDriven?: number;
  color?: string;
  acceptOffers?: boolean;
  offerPercentage?: number;
  insuranceValidTill?: string;
  insuranceType?: string;
  insuranceValid?: boolean;
  lastServiceDate?: string;
  serviceCenterType?: string;
  serviceHistory?: boolean;
  authorizedServiceCenter?: boolean;
  rtoTransferSupport?: boolean;
  noAccidentHistory?: boolean;
  isRentAvailable?: boolean;
  dailyRate?: string;
  weeklyRate?: string;
  securityDeposit?: string;
  city?: string;
  area?: string;
  landmark?: string;
  description?: string;
}

interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: { min: number; max: number };
  images: string[];
  location: string;
  views: number;
  postedDate: string;
  status: string;
  type: 'accessory';
}

interface MyListingsTabProps {
  listings: Listing[];
  accessories: Accessory[];
  onDeleteListing: (listingId: string, title: string) => void;
}

const MyListingsTab = ({ listings, accessories, onDeleteListing }: MyListingsTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPrice = (price: number | { min: number; max: number }) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      if (price.min === price.max) {
        return `₹${price.min.toLocaleString('en-IN')}`;
      }
      return `₹${price.min.toLocaleString('en-IN')} - ₹${price.max.toLocaleString('en-IN')}`;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleEditListing = (listing: Listing) => {
    const editData = {
      make: listing.make || '',
      model: listing.model || '',
      variant: listing.variant || '',
      year: listing.year?.toString() || '',
      registrationYear: listing.registrationYear?.toString() || '',
      registrationState: listing.registrationState || '',
      fitnessCertificateValidTill: listing.fitnessCertificateValidTill || '',
      numberOfOwners: listing.numberOfOwners || '1',
      seatingCapacity: listing.seatingCapacity || '5',
      fuelType: listing.fuelType || '',
      transmission: listing.transmission || '',
      kilometersDriven: listing.kilometersDriven?.toString() || '',
      color: listing.color || '',
      price: listing.price?.toString() || '',
      acceptOffers: listing.acceptOffers ?? true,
      offerPercentage: listing.offerPercentage?.toString() || '70',
      insuranceValidTill: listing.insuranceValidTill || '',
      insuranceType: listing.insuranceType || 'Comprehensive',
      insuranceValid: listing.insuranceValid ?? false,
      lastServiceDate: listing.lastServiceDate || '',
      serviceCenterType: listing.serviceCenterType || 'Authorized',
      serviceHistory: listing.serviceHistory ?? false,
      authorizedServiceCenter: listing.authorizedServiceCenter ?? false,
      rtoTransferSupport: listing.rtoTransferSupport ?? true,
      noAccidentHistory: listing.noAccidentHistory ?? false,
      isRentAvailable: listing.isRentAvailable ?? false,
      dailyRate: listing.dailyRate || '',
      weeklyRate: listing.weeklyRate || '',
      securityDeposit: listing.securityDeposit || '',
      city: listing.city || '',
      area: listing.area || '',
      landmark: listing.landmark || '',
      description: listing.description || '',
      // Add contact info for edit mode
      sellerName: 'John Doe', // Mock seller name
      phone: '+91 9876543210', // Mock phone
      email: 'john@example.com', // Mock email
      address: '123 Main Street', // Mock address
    };

    // Store in sessionStorage for the SellCar page to pick up
    sessionStorage.setItem('editListingData', JSON.stringify({
      ...editData,
      listingId: listing.id
    }));
    
    // Navigate to sell page with edit flag
    navigate(`/sell?edit=${listing.id}`);
    
    toast({
      title: "Editing Listing",
      description: "Loading your listing data for editing",
    });
  };

  const handleDuplicateListing = (listing: Listing) => {
    // Prepare duplicate data - same as edit but without sensitive info
    const duplicateData = {
      make: listing.make || '',
      model: listing.model || '',
      variant: listing.variant || '',
      year: listing.year?.toString() || '',
      registrationYear: listing.registrationYear?.toString() || '',
      registrationState: listing.registrationState || '',
      fitnessCertificateValidTill: listing.fitnessCertificateValidTill || '',
      numberOfOwners: listing.numberOfOwners || '1',
      seatingCapacity: listing.seatingCapacity || '5',
      fuelType: listing.fuelType || '',
      transmission: listing.transmission || '',
      kilometersDriven: listing.kilometersDriven?.toString() || '',
      color: listing.color || '',
      price: listing.price?.toString() || '',
      acceptOffers: listing.acceptOffers ?? true,
      offerPercentage: listing.offerPercentage?.toString() || '70',
      insuranceValidTill: listing.insuranceValidTill || '',
      insuranceType: listing.insuranceType || 'Comprehensive',
      insuranceValid: listing.insuranceValid ?? false,
      lastServiceDate: listing.lastServiceDate || '',
      serviceCenterType: listing.serviceCenterType || 'Authorized',
      serviceHistory: listing.serviceHistory ?? false,
      authorizedServiceCenter: listing.authorizedServiceCenter ?? false,
      rtoTransferSupport: listing.rtoTransferSupport ?? true,
      noAccidentHistory: listing.noAccidentHistory ?? false,
      isRentAvailable: listing.isRentAvailable ?? false,
      dailyRate: listing.dailyRate || '',
      weeklyRate: listing.weeklyRate || '',
      securityDeposit: listing.securityDeposit || '',
      city: listing.city || '',
      area: listing.area || '',
      landmark: listing.landmark || '',
      description: listing.description || '',
      // Clear sensitive fields for duplicate
      sellerName: '',
      phone: '',
      email: '',
      address: '',
    };

    // Store in sessionStorage for the SellCar page to pick up
    sessionStorage.setItem('duplicateListingData', JSON.stringify(duplicateData));
    
    // Navigate to sell page with duplicate flag
    navigate('/sell?duplicate=true');
  };

  const handleEditAccessory = (accessory: Accessory) => {
    navigate(`/post-accessory?edit=${accessory.id}`);
    toast({
      title: "Editing Accessory",
      description: "Loading your accessory data for editing",
    });
  };

  const activeListings = listings.filter(l => l.status === 'active');
  const activeAccessories = accessories.filter(a => a.status === 'active');
  const totalActive = activeListings.length + activeAccessories.length;

  if (totalActive === 0) {
    return (
      <Card className="p-4 md:p-6">
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Post your first car or accessory to get started</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/sell')}>
              <Car className="h-4 w-4 mr-2" />
              Post Your Car
            </Button>
            <Button variant="outline" onClick={() => navigate('/post-accessory')}>
              <Package className="h-4 w-4 mr-2" />
              Post Accessory
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-6">
        {/* Cars Section */}
        {listings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">My Cars ({listings.length})</h3>
            </div>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{listing.title}</h4>
                        {getStatusBadge(listing.status)}
                      </div>
                      <p className="text-primary font-bold text-xl mb-1">
                        {formatPrice(listing.price)}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {listing.postedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {listing.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditListing(listing)}
                        className="flex-1 md:flex-none"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDuplicateListing(listing)}
                        className="flex-1 md:flex-none text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDeleteListing(listing.id, listing.title)}
                        className="flex-1 md:flex-none text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Separator */}
        {listings.length > 0 && accessories.length > 0 && (
          <Separator />
        )}

        {/* Accessories Section */}
        {accessories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">My Accessories ({accessories.length})</h3>
            </div>
            <div className="space-y-4">
              {accessories.map((accessory) => (
                <div key={accessory.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg">{accessory.name}</h4>
                        {getStatusBadge(accessory.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{accessory.brand}</p>
                      <p className="text-primary font-bold text-xl mb-1">
                        {formatPrice(accessory.price)}
                      </p>
                      <p className="text-gray-600 text-sm mb-2">{accessory.location}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {accessory.postedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {accessory.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditAccessory(accessory)}
                        className="flex-1 md:flex-none"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onDeleteListing(accessory.id, accessory.name)}
                        className="flex-1 md:flex-none text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MyListingsTab;
