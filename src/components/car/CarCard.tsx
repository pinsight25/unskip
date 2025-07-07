
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Card, CardContent } from '@/components/ui/card';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import { useToast } from '@/hooks/use-toast';
import CarCardImage from './card/CarCardImage';
import CarCardPrice from './card/CarCardPrice';
import CarCardSpecs from './card/CarCardSpecs';
import CarCardSeller from './card/CarCardSeller';
import CarCardActions from './card/CarCardActions';

interface CarCardProps {
  car: Car;
  onSave?: (carId: string) => void;
  isSaved?: boolean;
}

const CarCard = ({ car, onSave, isSaved = false }: CarCardProps) => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [offerMade, setOfferMade] = useState(false);
  const { toast } = useToast();

  const handleMakeOffer = () => {
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleChat = () => {
    if (!offerMade) {
      toast({
        title: "Make an Offer First",
        description: "Please make an offer before starting a chat with the seller.",
        variant: "destructive"
      });
      return;
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(car.id);
    }
  };

  const handleOTPSuccess = () => {
    setIsVerified(true);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
    setOfferMade(true);
  };

  return (
    <>
      <Card className="group cards-equal-height overflow-hidden w-full max-w-[350px] mx-auto">
        <CardContent className="p-0 flex flex-col h-full">
          <CarCardImage car={car} isSaved={isSaved} onSave={handleSave} />

          <div className="card-padding flex-1 flex flex-col">
            {/* Title & Price */}
            <div className="element-spacing">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="heading-4 hover:text-primary transition-colors line-clamp-2 mb-2">
                  {car.title}
                </h3>
              </Link>
              <CarCardPrice car={car} />
            </div>

            <div className="element-spacing">
              <CarCardSpecs car={car} />
            </div>

            <div className="element-spacing">
              <CarCardSeller seller={car.seller} />
            </div>

            <div className="mt-auto">
              <CarCardActions 
                onMakeOffer={handleMakeOffer}
                onChat={handleChat}
                offerMade={offerMade}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        car={car}
        onSubmit={handleOfferSubmit}
      />

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPSuccess}
        phoneNumber="+91 98765 43210"
        purpose="make an offer"
      />
    </>
  );
};

export default CarCard;
