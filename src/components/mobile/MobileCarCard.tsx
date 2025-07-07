
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
    <Card className="mb-6 mx-4 overflow-hidden shadow-sm border border-gray-200 bg-white cursor-pointer" onClick={handleCardClick}>
      <MobileCarImage
        images={car.images}
        title={car.title}
        featured={car.featured}
        verified={car.verified}
        isSaved={isSaved}
        onSave={handleSave}
      />

      <div className="p-4 space-y-4">
        {/* Title and Price with consistent alignment */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-2">
              {car.title}
            </h3>
            <MobileCarPrice price={car.price} rentalRate={car.rentalRate} />
          </div>
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
