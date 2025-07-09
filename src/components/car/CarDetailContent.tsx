
import { Car } from '@/types/car';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CarImageGallery from '@/components/car/CarImageGallery';
import CarOverview from '@/components/car/CarOverview';
import SimpleVehicleInfo from '@/components/car/SimpleVehicleInfo';
import SellerCard from '@/components/car/SellerCard';
import CarActions from '@/components/car/CarActions';
import CarDetailTabs from '@/components/car/CarDetailTabs';

interface CarDetailContentProps {
  car: Car;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: () => void;
  onChatClick: () => void;
  onTestDrive: () => void;
}

const CarDetailContent = ({
  car,
  offerStatus,
  onMakeOffer,
  onChatClick,
  onTestDrive
}: CarDetailContentProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

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
          {/* Left Column - Image Gallery (Desktop: 2 columns width) */}
          <div className="lg:col-span-2 lg:sticky lg:top-4 lg:self-start space-y-4">
            <CarImageGallery
              images={car.images}
              title={car.title}
              featured={car.featured}
              verified={car.verified}
            />
            
            {/* Tabbed Details - Now under image gallery */}
            <CarDetailTabs car={car} />
          </div>

          {/* Right Column - Car Overview and Actions */}
          <div className="space-y-4">
            <CarOverview
              title={car.title}
              price={car.price}
              rentPrice={car.rentPrice}
              description={car.description}
              variant={car.variant}
              ownership={car.ownershipNumber}
              noAccidentHistory={car.noAccidentHistory}
              verified={car.verified}
              featured={car.featured}
              seatingCapacity={car.seatingCapacity}
            />

            {/* Quick Actions - Desktop Top */}
            <div className="hidden lg:block">
              <CarActions
                offerStatus={offerStatus}
                onMakeOffer={onMakeOffer}
                onChatClick={onChatClick}
                onTestDrive={onTestDrive}
              />
            </div>

            <SellerCard seller={car.seller} />

            <SimpleVehicleInfo
              ownership={car.ownershipNumber}
              year={car.year}
              mileage={car.kilometersDriven}
              location={car.location}
              landmark={car.landmark}
              insuranceValid={car.insuranceValid}
              insuranceValidTill={car.insuranceValidTill}
              insuranceType={car.insuranceType}
              lastServiceDate={car.lastServiceDate}
              serviceAtAuthorized={car.serviceAtAuthorized}
            />

            {/* Mobile Actions - Bottom */}
            <div className="lg:hidden">
              <CarActions
                offerStatus={offerStatus}
                onMakeOffer={onMakeOffer}
                onChatClick={onChatClick}
                onTestDrive={onTestDrive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailContent;
