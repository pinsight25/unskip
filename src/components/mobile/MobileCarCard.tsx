
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import MobileCarImage from './MobileCarImage';
import MobileCarPrice from './MobileCarPrice';
import MobileCarDetails from './MobileCarDetails';
import MobileCarActions from './MobileCarActions';

interface MobileCarCardProps {
  car: any;
  onSave: (carId: string) => void;
  isSaved: boolean;
  onMakeOffer: () => void;
  onChat: () => void;
  onTestDrive: () => void;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
}

const MobileCarCard = ({ 
  car, 
  onSave, 
  isSaved, 
  onMakeOffer, 
  onChat, 
  onTestDrive,
  offerStatus 
}: MobileCarCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
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
        isSaved={isSaved}
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
        />

        <MobileCarActions
          offerStatus={offerStatus}
          onMakeOffer={onMakeOffer}
          onChat={onChat}
          onTestDrive={onTestDrive}
        />
      </div>
    </Card>
  );
};

export default MobileCarCard;
