
import { useUserListings } from '@/hooks/queries/useCarQueries';
import { useUserAccessories } from '@/hooks/queries/useAccessories';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ListingCard from './listings/ListingCard';
import AccessoryCard from '@/components/accessories/AccessoryCard';
import { useListingHandlers } from '@/hooks/useListingHandlers';
import { formatPrice, getStatusVariant, getStatusText } from '@/utils/listingHelpers';
import { useAccessoryForm } from '@/hooks/useAccessoryForm';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

const MyListingsTab = () => {
  const { user } = useUser();
  const { data: carListings = [], isLoading: carsLoading, error: carsError } = useUserListings(user?.id);
  const { data: accessoryListings = [], isLoading: accessoriesLoading, error: accessoriesError } = useUserAccessories(user?.id || '');
  const { handleEditListing, handleDuplicateListing } = useListingHandlers();
  const { handleDelete: handleDeleteAccessory } = useAccessoryForm();

  const activeCarListings = carListings.filter((car: any) => car.status === 'active');
  const soldCarListings = carListings.filter((car: any) => car.status === 'sold');
  const activeAccessoryListings = accessoryListings.filter((accessory: any) => accessory.status === 'active');
  const soldAccessoryListings = accessoryListings.filter((accessory: any) => accessory.status === 'sold');

  // Helper to get cover image URL for cars
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

  const handleDeleteCarListing = () => {
    // TODO: Implement car deletion
  };

  const handleDeleteAccessoryListing = async (accessoryId: string) => {
    await handleDeleteAccessory(accessoryId);
  };

  const isLoading = carsLoading || accessoriesLoading;
  const hasError = carsError || accessoriesError;

  if (isLoading && carListings.length === 0 && accessoryListings.length === 0) {
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

  if (hasError) {
    return (
      <Card className="p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading listings</p>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cars Section */}
      <div>
        <h2 className="font-bold text-xl mb-4">Cars</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Active Car Listings ({activeCarListings.length})</h3>
          {activeCarListings.length === 0 && <div className="text-gray-500 mb-4">No active car listings</div>}
          {activeCarListings.map((car: any) => (
            <ListingCard
              key={car.id}
              listing={{ ...car, coverImageUrl: getCoverImageUrl(car) }}
              onEdit={handleEditListing}
              onDuplicate={handleDuplicateListing}
              onDelete={handleDeleteCarListing}
              formatPrice={formatPrice}
              getStatusVariant={getStatusVariant}
              getStatusText={getStatusText}
            />
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Sold Car Listings ({soldCarListings.length})</h3>
          {soldCarListings.length === 0 && <div className="text-gray-500 mb-4">No sold car listings</div>}
          {soldCarListings.map((car: any) => (
            <ListingCard
              key={car.id}
              listing={{ ...car, coverImageUrl: getCoverImageUrl(car) }}
              onEdit={handleEditListing}
              onDuplicate={handleDuplicateListing}
              onDelete={handleDeleteCarListing}
              formatPrice={formatPrice}
              getStatusVariant={getStatusVariant}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      </div>

      {/* Accessories Section */}
      <div>
        <h2 className="font-bold text-xl mb-4">Accessories</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Active Accessory Listings ({activeAccessoryListings.length})</h3>
          {activeAccessoryListings.length === 0 && <div className="text-gray-500 mb-4">No active accessory listings</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAccessoryListings.map((accessory: any) => (
              <div key={accessory.id} className="relative group">
                <AccessoryCard accessory={accessory} viewMode="grid" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteAccessoryListing(accessory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Sold Accessory Listings ({soldAccessoryListings.length})</h3>
          {soldAccessoryListings.length === 0 && <div className="text-gray-500 mb-4">No sold accessory listings</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {soldAccessoryListings.map((accessory: any) => (
              <div key={accessory.id} className="relative group">
                <AccessoryCard accessory={accessory} viewMode="grid" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteAccessoryListing(accessory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListingsTab;
