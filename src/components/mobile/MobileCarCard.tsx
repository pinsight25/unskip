
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
}

const MobileCarCard = ({ car, onSave, isSaved, onMakeOffer, onChat, onTestDrive }: MobileCarCardProps) => {
  const [offerStatus, setOfferStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };

  const handleChat = () => {
    if (offerStatus === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (offerStatus === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (offerStatus === 'accepted') {
      navigate('/chat/1');
    }
  };

  const handleTestDrive = () => {
    toast({
      title: "Test Drive Request",
      description: `Test drive request sent for ${car.title}`,
    });
    console.log('Test drive requested for car:', car.id);
  };

  const handleSave = () => {
    onSave(car.id);
  };

  return (
    <Card className="mb-4 mx-4 overflow-hidden shadow-sm border border-gray-200 bg-white cursor-pointer" onClick={handleCardClick}>
      <MobileCarImage
        images={car.images}
        title={car.title}
        featured={car.featured}
        verified={car.verified}
        isSaved={isSaved}
        onSave={handleSave}
      />

      <div className="p-4">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
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
          onChat={handleChat}
          onTestDrive={handleTestDrive}
        />
      </div>
    </Card>
  );
};

export default MobileCarCard;
