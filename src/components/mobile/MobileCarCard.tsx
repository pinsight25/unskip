import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import MobileCarImage from './MobileCarImage';
import MobileCarPrice from './MobileCarPrice';
import MobileCarDetails from './MobileCarDetails';
import MobileCarActions from './MobileCarActions';
import { useUser } from '@/contexts/UserContext';
import { useOfferStatus } from '@/hooks/queries/useOfferStatus';
import { useCarViewCount } from '@/hooks/useCarViews';
import { Eye } from 'lucide-react';

interface MobileCarCardProps {
  car: any;
  sellerId?: string;
  onSave: (carId: string) => void;
  isSaved: boolean;
  isSaving?: boolean;
  onMakeOffer: () => void;
  onChat: () => void;
  onTestDrive: () => void;
}

const MobileCarCard = ({ 
  car, 
  sellerId,
  onSave, 
  isSaved, 
  isSaving = false,
  onMakeOffer, 
  onChat, 
  onTestDrive
}: MobileCarCardProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const isOwner = user && user.id === car.seller.id;

  // Use React Query for offer status
  const { data: offer } = useOfferStatus(car.id, user?.id);
  const offerStatus = offer?.status || 'none';
  const offerAmount = offer?.amount || null;

  const { data: viewCount = 0 } = useCarViewCount(car.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    navigate(`/car/${car.id}`);
  };

  const handleSave = () => {
    onSave(car.id);
  };

  return (
    <Card className="overflow-hidden cursor-pointer container-safe mb-4" onClick={handleCardClick}>
      <MobileCarImage
        images={car.images}
        title={car.title}
        featured={car.featured}
        verified={car.verified}
        seller_type={car.seller_type}
        dealerVerified={car.seller?.dealerVerified}
        isSaved={isSaved}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <div className="card-padding-mobile space-y-4">
        {/* Title and Price */}
        <div>
          <h3 className="heading-4 line-clamp-1 mb-2">
            {car.title}
          </h3>
          <MobileCarPrice price={car.price} rentalRate={car.rentalRate} />
        </div>

        <MobileCarDetails
          year={car.year}
          transmission={car.transmission}
          fuelType={car.fuelType}
          mileage={car.mileage}
          location={car.location}
          seller={car.seller}
          seller_type={car.seller_type}
          viewCount={viewCount}
          ownership={car.ownership || car.ownershipNumber || 1}
        />

        <MobileCarActions
          carId={car.id}
          sellerId={sellerId || car.seller.id}
          offerStatus={offerStatus}
          offerAmount={offerAmount}
          onMakeOffer={(e) => {
            e?.stopPropagation();
            onMakeOffer();
          }}
          onChat={(e) => {
            e?.stopPropagation();
            onChat();
          }}
          onTestDrive={(e) => {
            e?.stopPropagation();
            onTestDrive();
          }}
          isOwner={isOwner}
          onViewOffers={isOwner ? () => navigate('/profile?tab=received-offers') : undefined}
          sellerPhone={car.seller.phone} // Pass seller phone
        />
      </div>
    </Card>
  );
};

export default MobileCarCard;
