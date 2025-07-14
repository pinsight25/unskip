
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import { useOfferContext } from '@/contexts/OfferContext';
import CarDetailContent from './CarDetailContent';
import CarDetailModals from './CarDetailModals';
import SignInModal from '@/components/modals/SignInModal';

interface CarDetailContainerProps {
  car: Car;
}

const CarDetailContainer = ({ car }: CarDetailContainerProps) => {
  const navigate = useNavigate();
  const { navigateToChat } = useChatManager();
  const { makeOffer } = useOfferContext();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [offerStatus, setOfferStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { toast } = useToast();

  const handleMakeOffer = () => {
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleOTPSuccess = () => {
    setIsVerified(true);
    setShowOTPModal(false);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
    
    // Mark offer as made in context
    makeOffer(car.id);
    
    setOfferStatus('pending');
    
    // Simulate offer acceptance after 3 seconds
    setTimeout(() => {
      setOfferStatus('accepted');
      toast({
        title: "Offer Accepted! 🎉",
        description: "Great news! The seller has accepted your offer. You can now chat with them.",
      });
    }, 3000);

    toast({
      title: "Offer submitted!",
      description: "Your offer has been sent to the seller.",
    });
    setShowOfferModal(false);
  };

  const handleChatClick = () => {
    if (offerStatus === 'accepted') {
      // Navigate to chat page with the car ID
      navigateToChat(car.id);
    }
  };

  const handleTestDrive = () => {
    setShowTestDriveModal(true);
  };

  const handleTestDriveScheduled = (booking: any) => {
    toast({
      title: "Test Drive Scheduled! 🚗",
      description: `Your test drive is confirmed for ${booking.date} at ${booking.timeSlot}`,
    });
  };

  return (
    <>
      <CarDetailContent
        car={car}
        offerStatus={offerStatus}
        onMakeOffer={handleMakeOffer}
        onChatClick={handleChatClick}
        onTestDrive={handleTestDrive}
        sellerId={car.seller.id}
        onViewOffers={() => {/* TODO: navigate to offers tab */}}
        onMarkSold={() => {/* TODO: mark car as sold */}}
        setSignInModalOpen={() => setIsSignInModalOpen(true)}
      />

      <CarDetailModals
        car={car}
        showOfferModal={showOfferModal}
        showOTPModal={showOTPModal}
        showTestDriveModal={showTestDriveModal}
        onCloseOfferModal={() => setShowOfferModal(false)}
        onCloseOTPModal={() => setShowOTPModal(false)}
        onCloseTestDriveModal={() => setShowTestDriveModal(false)}
        onOTPSuccess={handleOTPSuccess}
        onOfferSubmit={handleOfferSubmit}
        onTestDriveScheduled={handleTestDriveScheduled}
      />
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
};

export default CarDetailContainer;
