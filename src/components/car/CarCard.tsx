import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CarCardImage from './card/CarCardImage';
import CarCardPrice from './card/CarCardPrice';
import CarCardSpecs from './card/CarCardSpecs';
import CarCardSeller from './card/CarCardSeller';
import CarCardActions from './card/CarCardActions';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import MakeOfferModal from '@/components/car-details/MakeOfferModal';
import { useOfferStatus } from '@/hooks/queries/useOfferStatus';
import { useChatManager } from '@/hooks/useChatManager';

interface CarCardProps {
  car: Car;
  onSave?: (carId: string) => void;
  isSaved?: boolean;
}

const CarCard = ({ car, onSave, isSaved = false }: CarCardProps) => {
  const { openSignInModal } = useAuthModal();
  const { user } = useUser();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const isOwner = user && user.id === car.seller.id;
  const { navigateToChat } = useChatManager();

  // Use React Query for offer status (backend-driven)
  const { data: offer } = useOfferStatus(car.id, user?.id);
  const offerStatus = offer?.status || 'none';
  const offerAmount = offer?.amount || null;

  const handleMakeOffer = () => {
    if (!user || !user.isVerified) {
      openSignInModal(() => {
        setShowOfferModal(true);
      });
      return;
    }
    setShowOfferModal(true);
  };

  const handleChat = async () => {
    if (offerStatus !== 'accepted') {
      toast({
        title: "Make an Offer First",
        description: "Please make an offer before starting a chat with the seller.",
        variant: "destructive"
      });
      return;
    }
    try {
      await navigateToChat(car.id, user.id, car.seller.id, toast);
    } catch (err) {
      toast({ title: 'Failed to open chat', description: err.message, variant: 'destructive' });
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
    // No local offerMade state needed
  };

  return (
    <>
      <Card className="group cards-equal-height overflow-hidden w-full max-w-[350px] min-w-[260px] mx-auto">
        <CardContent className="p-0 flex flex-col h-full">
          <CarCardImage car={car} isSaved={isSaved} onSave={handleSave} />

          <div className="card-padding flex-1 flex flex-col">
            {/* Title & Price */}
            <div className="element-spacing">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="heading-4 hover:text-primary transition-colors mb-2">
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
                offerStatus={offerStatus}
                offerAmount={offerAmount}
                isOwner={isOwner}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {!isOwner && (
        <>
          <MakeOfferModal
            isOpen={showOfferModal}
            onClose={() => setShowOfferModal(false)}
            car={{
              id: car.id,
              title: car.title,
              price: car.price,
              images: car.images?.map(url => ({ url })) || [],
              seller_id: car.seller.id,
            }}
          />
        </>
      )}
    </>
  );
};

export default CarCard;
