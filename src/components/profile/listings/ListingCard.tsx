
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import ListingActions from './ListingActions';

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

interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDuplicate: (listing: Listing) => void;
  onDelete: (listingId: string, title: string) => void;
  formatPrice: (price: number) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

const ListingCard = ({ 
  listing, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  formatPrice, 
  getStatusBadge 
}: ListingCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
        <ListingActions
          onEdit={() => onEdit(listing)}
          onDuplicate={() => onDuplicate(listing)}
          onDelete={() => onDelete(listing.id, listing.title)}
        />
      </div>
    </div>
  );
};

export default ListingCard;
