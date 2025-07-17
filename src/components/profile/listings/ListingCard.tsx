
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Edit } from 'lucide-react';
import ListingActions from './ListingActions';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
  coverImageUrl?: string;
}

interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDuplicate: (listing: Listing) => void;
  onDelete: (listingId: string, title: string) => void;
  formatPrice: (price: number) => string;
  getStatusVariant: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ListingCard = ({ 
  listing, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  formatPrice, 
  getStatusVariant,
  getStatusText
}: ListingCardProps) => {
  const fallbackImage = '/placeholder.svg';
  const imageUrl = listing.coverImageUrl || fallbackImage;
  const navigate = useNavigate();
  const isSold = listing.status === 'sold';
  return (
    <div id={`listing-${listing.id}`} className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isSold ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <Link to={`/car/${listing.id}`} className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden block group">
          <img
            src={imageUrl}
            alt={listing.title || 'Car'}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            onError={e => { (e.target as HTMLImageElement).src = fallbackImage; }}
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-lg">{listing.title}</h4>
            <Badge className={getStatusVariant(listing.status)}>
              {getStatusText(listing.status)}
            </Badge>
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
        <div className="flex flex-col gap-2 items-center">
          <ListingActions
            onEdit={() => onEdit(listing)}
            onDuplicate={() => onDuplicate(listing)}
            onDelete={() => onDelete(listing.id, listing.title)}
            disabled={isSold}
          />
          <Link to={`/car/${listing.id}`} className="mt-2 text-xs text-blue-600 underline">View</Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
