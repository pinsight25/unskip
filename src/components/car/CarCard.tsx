
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
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 overflow-hidden w-full max-w-[350px] mx-auto">
        <CardContent className="p-0">
          <CarCardImage car={car} isSaved={isSaved} onSave={handleSave} />

          <div className="p-4 space-y-4">
            {/* Title & Price */}
            <div className="space-y-3">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="font-semibold text-lg leading-tight hover:text-orange-500 transition-colors line-clamp-2 text-gray-900">
                  {car.title}
                </h3>
              </Link>
              <CarCardPrice car={car} />
            </div>

            <CarCardSpecs car={car} />

            <CarCardSeller seller={car.seller} />

            <CarCardActions 
              onMakeOffer={handleMakeOffer}
              onChat={handleChat}
              offerMade={offerMade}
            />
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
