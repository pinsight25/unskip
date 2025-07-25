
import { useUserListings } from '@/hooks/queries/useCarQueries';
import { useUserAccessories } from '@/hooks/queries/useAccessories';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ListingCard from './listings/ListingCard';
import ListingActions from './listings/ListingActions';
import AccessoryCard from '@/components/accessories/AccessoryCard';
import { useListingHandlers } from '@/hooks/useListingHandlers';
import { formatPrice, getStatusVariant, getStatusText } from '@/utils/listingHelpers';
import { useAccessoryForm } from '@/hooks/useAccessoryForm';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useCarViewCount } from '@/hooks/useCarViews';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock } from 'lucide-react';

const MyListingsTab = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: carListings = [], isLoading: carsLoading, error: carsError } = useUserListings(user?.id);
  const { data: accessoryListings = [], isLoading: accessoriesLoading, error: accessoriesError } = useUserAccessories(user?.id || '');
  const { handleEditListing, handleDuplicateListing } = useListingHandlers();
  const { handleDelete: handleDeleteAccessory, isLoading: isDeletingAccessory } = useAccessoryForm();

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string;
    itemName: string;
    itemType: 'car' | 'accessory';
  }>({
    isOpen: false,
    itemId: '',
    itemName: '',
    itemType: 'accessory',
  });

  // Wrapper component for car with view count
  const CarWithViewCount = ({ car }: { car: any }) => {
    const { data: viewCount = 0 } = useCarViewCount(car.id);
    const coverImageUrl = getCoverImageUrl(car) || '/placeholder.svg';
    
    const carWithViews = {
      ...car,
      coverImageUrl,
      location: car.location || [car.area, car.city].filter(Boolean).join(', ') || 'Location not specified',
      views: viewCount,
      postedDate: car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'
    };

    return (
      <ListingCard
        key={car.id}
        listing={carWithViews}
        onEdit={handleEditListing}
        onDuplicate={handleDuplicateListing}
        onDelete={handleDeleteCarListing}
        formatPrice={formatPrice}
        getStatusVariant={getStatusVariant}
        getStatusText={getStatusText}
      />
    );
  };

  // Wrapper component for accessory with view count
  const ListingAccessoryCard = ({ accessory, onEdit, onDuplicate, onDelete }: any) => {
    const isSold = accessory.status === 'sold';
    const imageUrl = accessory.images && accessory.images.length > 0 ? accessory.images[0] : '/placeholder.svg';
    const price = formatPrice(accessory.price);
    const location = [accessory.area, accessory.city].filter(Boolean).join(', ') || 'Location not specified';
    const views = accessory.views || 0;
    const postedDate = accessory.created_at ? new Date(accessory.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    
    return (
      <div id={`accessory-${accessory.id}`} className={`border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow ${isSold ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <Link to={`/accessories/${accessory.id}`} className="w-full md:w-32 h-20 md:h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden block group">
            <img
              src={imageUrl}
              alt={accessory.name || 'Accessory'}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
            />
          </Link>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-base md:text-lg">{accessory.name}</h4>
              <Badge className={accessory.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {accessory.status === 'active' ? 'Active' : accessory.status}
              </Badge>
            </div>
            <p className="text-primary font-bold text-lg md:text-xl mb-1">
              {price}
            </p>
            <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-2">
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                {postedDate}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
                {views} views
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ListingActions
              onEdit={() => onEdit(accessory.id)}
              onDuplicate={() => onDuplicate(accessory)}
              onDelete={() => onDelete(accessory.id, accessory.name, 'accessory')}
              disabled={isSold}
            />
            <Link to={`/accessories/${accessory.id}`} className="text-xs text-blue-600 underline">View</Link>
          </div>
        </div>
      </div>
    );
  };

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
    setDeleteModal({ isOpen: false, itemId: '', itemName: '', itemType: 'accessory' });
  };

  const handleEditAccessory = (accessoryId: string) => {
    navigate(`/accessories/${accessoryId}/edit`);
  };

  const openDeleteModal = (itemId: string, itemName: string, itemType: 'car' | 'accessory') => {
    setDeleteModal({
      isOpen: true,
      itemId,
      itemName,
      itemType,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, itemId: '', itemName: '', itemType: 'accessory' });
  };

  const confirmDelete = () => {
    if (deleteModal.itemType === 'accessory') {
      handleDeleteAccessoryListing(deleteModal.itemId);
    } else {
      handleDeleteCarListing();
    }
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
        <div className="text-center py-8 md:py-12">
          <p className="text-red-600 mb-4">Error loading listings</p>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cars Section */}
      <div>
        <h2 className="font-bold text-lg md:text-xl mb-4">Cars</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-base md:text-lg mb-2">Active Car Listings ({activeCarListings.length})</h3>
          {activeCarListings.length === 0 && <div className="text-gray-500 mb-4 text-sm md:text-base">No active car listings</div>}
          <div className="space-y-3 md:space-y-4">
            {activeCarListings.map((car: any) => (
              <CarWithViewCount key={car.id} car={car} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base md:text-lg mb-2">Sold Car Listings ({soldCarListings.length})</h3>
          {soldCarListings.length === 0 && <div className="text-gray-500 mb-4 text-sm md:text-base">No sold car listings</div>}
          <div className="space-y-3 md:space-y-4">
            {soldCarListings.map((car: any) => (
              <CarWithViewCount key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>

      {/* Accessories Section */}
      <div>
        <h2 className="font-bold text-lg md:text-xl mb-4">Accessories</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-base md:text-lg mb-2">Active Accessory Listings ({activeAccessoryListings.length})</h3>
          {activeAccessoryListings.length === 0 && <div className="text-gray-500 mb-4 text-sm md:text-base">No active accessory listings</div>}
          <div className="space-y-3 md:space-y-4">
            {activeAccessoryListings.map((accessory: any) => (
              <ListingAccessoryCard
                key={accessory.id}
                accessory={accessory}
                onEdit={handleEditAccessory}
                onDuplicate={handleDuplicateListing}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base md:text-lg mb-2">Sold Accessory Listings ({soldAccessoryListings.length})</h3>
          {soldAccessoryListings.length === 0 && <div className="text-gray-500 mb-4 text-sm md:text-base">No sold accessory listings</div>}
          <div className="space-y-3 md:space-y-4">
            {soldAccessoryListings.map((accessory: any) => (
              <ListingAccessoryCard
                key={accessory.id}
                accessory={accessory}
                onEdit={handleEditAccessory}
                onDuplicate={handleDuplicateListing}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={`Delete ${deleteModal.itemType ? deleteModal.itemType.charAt(0).toUpperCase() + deleteModal.itemType.slice(1) : 'Item'}`}
        description={`Are you sure you want to delete "${deleteModal.itemName || 'this item'}"? This action cannot be undone.`}
        isLoading={isDeletingAccessory}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
      />
    </div>
  );
};

export default MyListingsTab;
