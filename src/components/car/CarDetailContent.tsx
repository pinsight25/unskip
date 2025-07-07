
import { Car } from '@/types/car';
import CarImageGallery from '@/components/car/CarImageGallery';
import CarOverview from '@/components/car/CarOverview';
import CarSpecifications from '@/components/car/CarSpecifications';
import SellerCard from '@/components/car/SellerCard';
import CarActions from '@/components/car/CarActions';

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
  return (
    <div className="desktop-page-container pb-32 md:pb-6">
      <CarImageGallery
        images={car.images}
        title={car.title}
        featured={car.featured}
        verified={car.verified}
      />

      {/* Car Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-standard desktop-content-spacing">
        {/* Left Column - Car Overview */}
        <div>
          <CarOverview
            title={car.title}
            price={car.price}
            rentPrice={car.rentPrice}
            description={car.description}
          />

          <CarSpecifications
            year={car.year}
            transmission={car.transmission}
            fuelType={car.fuelType}
            location={car.location}
            seller={car.seller}
          />
        </div>

        {/* Right Column - Seller & Actions */}
        <div>
          <SellerCard seller={car.seller} />

          {/* Actions Section with extra bottom padding on mobile */}
          <div className="mb-8 md:mb-0">
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
  );
};

export default CarDetailContent;
