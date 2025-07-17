
import { useUserListings } from '@/hooks/queries/useCarQueries';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ListingCard from './listings/ListingCard';
import { useListingHandlers } from '@/hooks/useListingHandlers';
import { formatPrice, getStatusVariant, getStatusText } from '@/utils/listingHelpers';

const MyListingsTab = () => {
  const { user } = useUser();
  const { data: listings = [], isLoading, error } = useUserListings(user?.id);
  const { handleEditListing, handleDuplicateListing } = useListingHandlers();
  // You may want to pass a delete handler as well, for now use a no-op
  const handleDeleteListing = () => {};

  const activeListings = listings.filter((car: any) => car.status === 'active');
  const soldListings = listings.filter((car: any) => car.status === 'sold');

  // Helper to get cover image URL
  const getCoverImageUrl = (car: any) => {
    if (Array.isArray(car.images) && car.images.length > 0) {
      return car.images[0];
    }
    if (Array.isArray(car.car_images) && car.car_images.length > 0) {
      // Fallback for raw DB rows
      return car.car_images[0].image_url;
    }
    return undefined;
  };

  if (isLoading && listings.length === 0) {
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

  if (error) {
    return (
      <Card className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error.message || 'Error loading listings'}</p>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Active Listings ({activeListings.length})</h2>
      {activeListings.length === 0 && <div className="text-gray-500 mb-4">No active listings</div>}
      {activeListings.map((car: any) => (
        <ListingCard
          key={car.id}
          listing={{ ...car, coverImageUrl: getCoverImageUrl(car) }}
          onEdit={handleEditListing}
          onDuplicate={handleDuplicateListing}
          onDelete={handleDeleteListing}
          formatPrice={formatPrice}
          getStatusVariant={getStatusVariant}
          getStatusText={getStatusText}
        />
      ))}
      <h2 className="font-bold text-lg mt-6 mb-2">Sold Listings ({soldListings.length})</h2>
      {soldListings.length === 0 && <div className="text-gray-500 mb-4">No sold listings</div>}
      {soldListings.map((car: any) => (
        <ListingCard
          key={car.id}
          listing={{ ...car, coverImageUrl: getCoverImageUrl(car) }}
          onEdit={handleEditListing}
          onDuplicate={handleDuplicateListing}
          onDelete={handleDeleteListing}
          formatPrice={formatPrice}
          getStatusVariant={getStatusVariant}
          getStatusText={getStatusText}
        />
      ))}
    </div>
  );
};

export default MyListingsTab;
