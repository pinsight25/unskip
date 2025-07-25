
import { Car } from '@/types/car';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CarImageGallery from '@/components/car/CarImageGallery';
import CarPriceSection from '@/components/car/CarPriceSection';
import CarOverview from '@/components/car/CarOverview';
import SellerCard from '@/components/car/SellerCard';
import CarActions from '@/components/car/CarActions';
import CarDetailTabs from '@/components/car/CarDetailTabs';

interface CarDetailContentProps {
  car: Car;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: () => void;
  onChatClick: () => void;
  onTestDrive: () => void;
  sellerId: string;
  onViewOffers?: () => void;
  onMarkSold?: () => void;
  offerCount?: number;
  setSignInModalOpen?: () => void;
}

const CarDetailContent = ({
  car,
  offerStatus,
  onMakeOffer,
  onChatClick,
  onTestDrive,
  sellerId,
  onViewOffers,
  onMarkSold,
  offerCount,
  setSignInModalOpen
}: CarDetailContentProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const displayTitle = car.variant ? `${car.title} ${car.variant}` : car.title;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 pb-32 md:pb-6">
        {/* Back Navigation */}
        <div className="mb-4 md:mb-6 pt-4">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm md:text-base">Back to listings</span>
          </Button>
        </div>

        {/* Desktop 3-column layout, Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Gallery and Details */}
          <div className="lg:col-span-2 lg:sticky lg:top-4 lg:self-start space-y-4">
            <CarImageGallery
              images={car.images}
              title={car.title}
              featured={car.featured}
              verified={car.verified}
              seller={car.seller}
            />
            
            {/* Car Title and Price - Now above toggles */}
            <CarPriceSection 
              title={displayTitle}
              price={car.price}
              rentPrice={car.rentPrice}
            />

            {/* Car Overview Badges */}
            <CarOverview
              title=""
              price={0}
              description=""
              variant={car.variant}
              ownership={car.ownershipNumber}
              noAccidentHistory={car.noAccidentHistory}
              verified={car.verified}
              featured={car.featured}
              seatingCapacity={car.seatingCapacity}
            />

            {/* Description Box - Styled like accessories detail page */}
            {car.description && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{car.description}</p>
              </div>
            )}
            
            {/* Tabbed Details */}
            <CarDetailTabs car={car} />
          </div>

          {/* Right Column - Seller and Actions */}
          <div className="space-y-4">
            <SellerCard seller={car.seller} />

            {/* Action buttons - Now below seller card */}
            <CarActions
              carId={car.id}
              sellerId={sellerId}
              offerStatus={offerStatus}
              onMakeOffer={onMakeOffer}
              onChatClick={onChatClick}
              onTestDrive={onTestDrive}
              onViewOffers={onViewOffers}
              onMarkSold={onMarkSold}
              offerCount={offerCount}
              setSignInModalOpen={setSignInModalOpen}
              sellerPhone={car.seller.phone} // Pass seller phone
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailContent;
