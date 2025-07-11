
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Car, Package } from 'lucide-react';
import { useListingHandlers } from '@/hooks/useListingHandlers';
import { formatPrice, getStatusVariant, getStatusText } from '@/utils/listingHelpers';
import ListingCard from './listings/ListingCard';
import AccessoryCard from './listings/AccessoryCard';
import EmptyListingsState from './listings/EmptyListingsState';

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
  const { handleEditListing, handleDuplicateListing, handleEditAccessory } = useListingHandlers();

  const activeListings = listings.filter(l => l.status === 'active');
  const activeAccessories = accessories.filter(a => a.status === 'active');
  const totalActive = activeListings.length + activeAccessories.length;

  if (totalActive === 0) {
    return <EmptyListingsState />;
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
    </Card>
  );
};

export default MyListingsTab;
