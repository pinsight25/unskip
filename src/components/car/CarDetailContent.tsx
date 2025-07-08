
import { Car } from '@/types/car';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CarImageGallery from '@/components/car/CarImageGallery';
import CarOverview from '@/components/car/CarOverview';
import SimpleVehicleInfo from '@/components/car/SimpleVehicleInfo';
import BasicSpecs from '@/components/car/BasicSpecs';
import SellerCard from '@/components/car/SellerCard';
import CarActions from '@/components/car/CarActions';
import RentalTerms from '@/components/car/RentalTerms';

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
    navigate(-1);
  };

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 pb-32 md:pb-6">
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

        {/* Desktop 2-column layout, Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image Gallery */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <CarImageGallery
              images={car.images}
              title={car.title}
              featured={car.featured}
              verified={car.verified}
            />
          </div>

          {/* Right Column - Car Details */}
          <div className="space-y-4">
            <CarOverview
              title={car.title}
              price={car.price}
              rentPrice={car.rentPrice}
              description={car.description}
            />

            <SimpleVehicleInfo
              ownership={car.ownership}
              year={car.year}
              mileage={car.mileage}
              location={car.location}
              landmark={car.landmark}
              insurance={car.insurance}
              serviceHistory={car.serviceHistory}
            />

            <BasicSpecs
              year={car.year}
              fuelType={car.fuelType}
              transmission={car.transmission}
              mileage={car.mileage}
            />

            {car.isRentAvailable && car.rentPolicies && (
              <RentalTerms rentPolicies={car.rentPolicies} />
            )}

            <SellerCard seller={car.seller} />

            <div className="lg:sticky lg:bottom-4">
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
