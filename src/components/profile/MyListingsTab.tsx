
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Car, Package } from 'lucide-react';
import { useListingHandlers } from '@/hooks/useListingHandlers';
import { formatPrice, getStatusVariant, getStatusText } from '@/utils/listingHelpers';
import ListingCard from './listings/ListingCard';
import AccessoryCard from './listings/AccessoryCard';
import EmptyListingsState from './listings/EmptyListingsState';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  views: number;
  status: string;
  created_at: string;
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
  isLoading: boolean;
  isRefetching?: boolean;
  error: string | null;
  onDeleteListing: (listingId: string, title: string) => void;
}

const MyListingsTab = ({ listings, accessories, isLoading, isRefetching, error, onDeleteListing }: MyListingsTabProps) => {
  console.log('MyListingsTab: Component rendered with props:', {
    listingsCount: listings?.length || 0,
    accessoriesCount: accessories?.length || 0,
    isLoading,
    isRefetching,
    error,
    listings: listings,
    accessories: accessories
  });

  const { handleEditListing, handleDuplicateListing, handleEditAccessory } = useListingHandlers();

  // Show loading state
  if (isLoading) {
    console.log('MyListingsTab: Showing loading state');
    return (
      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    console.log('MyListingsTab: Showing error state:', error);
    return (
      <Card className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  const activeListings = listings.filter(l => l.status === 'active');
  const activeAccessories = accessories.filter(a => a.status === 'active');
  const totalActive = activeListings.length + activeAccessories.length;

  console.log('MyListingsTab: Active counts:', {
    activeListings: activeListings.length,
    activeAccessories: activeAccessories.length,
    totalActive
  });

  // Show empty state when no active listings
  if (totalActive === 0) {
    console.log('MyListingsTab: No active listings, showing empty state');
    return (
      <Card className="p-4 md:p-6">
        <p className="text-gray-500 text-center mt-8">No cars listed yet</p>
      </Card>
    );
  }

  // Helper function to format date relative to now
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Transform listings to include postedDate
  const listingsWithDate = listings.map(listing => ({
    ...listing,
    location: listing.city,
    postedDate: formatRelativeDate(listing.created_at)
  }));

  // Accessories already come with postedDate from the hook, so no transformation needed
  const accessoriesWithRequiredFields = accessories.map(accessory => ({
    ...accessory,
    images: accessory.images || [], // Ensure images field exists
  }));

  console.log('MyListingsTab: Processed data:', {
    listingsWithDate: listingsWithDate.length,
    accessoriesWithRequiredFields: accessoriesWithRequiredFields.length
  });

  return (
    <Card className="p-4 md:p-6 relative">
      <div className="space-y-6">
        {/* Cars Section */}
        {listingsWithDate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">My Cars ({listingsWithDate.length})</h3>
            </div>
            <div className="space-y-4">
              {listingsWithDate.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onEdit={handleEditListing}
                  onDuplicate={handleDuplicateListing}
                  onDelete={onDeleteListing}
                  formatPrice={formatPrice}
                  getStatusVariant={getStatusVariant}
                  getStatusText={getStatusText}
                />
              ))}
            </div>
          </div>
        )}

        {/* Separator */}
        {listingsWithDate.length > 0 && accessoriesWithRequiredFields.length > 0 && (
          <Separator />
        )}

        {/* Accessories Section */}
        {accessoriesWithRequiredFields.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">My Accessories ({accessoriesWithRequiredFields.length})</h3>
            </div>
            <div className="space-y-4">
              {accessoriesWithRequiredFields.map((accessory) => (
                <AccessoryCard
                  key={accessory.id}
                  accessory={accessory}
                  onEdit={handleEditAccessory}
                  onDelete={onDeleteListing}
                  formatPrice={formatPrice}
                  getStatusVariant={getStatusVariant}
                  getStatusText={getStatusText}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {isRefetching && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      )}
    </Card>
  );
};

export default MyListingsTab;
