
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import { useOfferContext } from '@/contexts/OfferContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useUser } from '@/contexts/UserContext';
import CarDetailContent from './CarDetailContent';
import CarDetailModals from './CarDetailModals';

interface CarDetailContainerProps {
  car: Car;
}

const CarDetailContainer = ({ car }: CarDetailContainerProps) => {
  const navigate = useNavigate();
  const { navigateToChat } = useChatManager();
  const { makeOffer } = useOfferContext();
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [offerStatus, setOfferStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { toast } = useToast();

  // Check if current user is the car owner
  const isOwner = user && user.id === car.seller.id;

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

  const handleOpenSignInModal = () => {
    console.log('[CarDetailContainer] Opening SignInModal');
    setIsSignInModalOpen(true);
  };

  // Handle View Offers button click
  const handleViewOffers = () => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only the car owner can view offers.",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to profile page with offers tab
    navigate('/profile?tab=received-offers');
  };

  // Handle Mark as Sold button click
  const handleMarkAsSold = async () => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only the car owner can mark the car as sold.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update car status in database
      const { error } = await supabase
        .from('cars')
        .update({ 
          status: 'sold',
          updated_at: new Date().toISOString()
        })
        .eq('id', car.id);
      
      if (error) {
        console.error('Error marking car as sold:', error);
        toast({
          title: "Error",
          description: "Failed to mark car as sold. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Set flags for refresh
      localStorage.setItem('carSold', JSON.stringify({
        timestamp: Date.now(),
        carId: car.id
      }));
      localStorage.setItem('carsListUpdated', JSON.stringify({
        timestamp: Date.now(),
        action: 'sold',
        carId: car.id
      }));
      
      toast({
        title: "Car Marked as Sold! ✅",
        description: "Your car has been marked as sold successfully.",
      });
      
      // Navigate back to profile
      navigate('/profile');
    } catch (error) {
      console.error('Error marking car as sold:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
        onViewOffers={handleViewOffers}
        onMarkSold={handleMarkAsSold}
        setSignInModalOpen={handleOpenSignInModal}
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
    </>
  );
};

export default CarDetailContainer;
