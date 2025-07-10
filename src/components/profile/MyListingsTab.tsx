
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, Eye, Edit, Trash2, Copy } from 'lucide-react';

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

interface MyListingsTabProps {
  listings: Listing[];
  onDeleteListing: (listingId: string, title: string) => void;
}

const MyListingsTab = ({ listings, onDeleteListing }: MyListingsTabProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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

  const handleDuplicateListing = (listing: Listing) => {
    // Store the listing data for duplication
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
    };

    // Store in sessionStorage for the SellCar page to pick up
    sessionStorage.setItem('duplicateListingData', JSON.stringify(duplicateData));
    
    // Navigate to sell page with duplicate flag
    navigate('/sell?duplicate=true');
  };

  return (
    <Card className="p-4 md:p-6">
      {listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
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
                    onClick={() => navigate(`/sell?edit=${listing.id}`)}
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
      ) : (
        <div className="text-center py-12">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Post your first car to get started</p>
          <Button onClick={() => navigate('/sell')}>
            <Car className="h-4 w-4 mr-2" />
            Post Your Car
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MyListingsTab;
