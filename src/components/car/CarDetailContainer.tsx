
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import { useOfferContext } from '@/contexts/OfferContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useUser } from '@/contexts/UserContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import CarDetailContent from './CarDetailContent';
import CarDetailModals from './CarDetailModals';
import { Phone, MessageCircle } from 'lucide-react';
import MakeOfferModal from '@/components/car-details/MakeOfferModal';
import { useOfferStatus } from '@/hooks/queries/useOfferStatus';
import { useQueryClient } from '@tanstack/react-query';
import { useTrackCarView } from '@/hooks/useCarViews';

interface CarDetailContainerProps {
  car: Car;
}

const CarDetailContainer = ({ car }: CarDetailContainerProps) => {
  useTrackCarView(car);
  const navigate = useNavigate();
  const { navigateToChat } = useChatManager();
  const { makeOffer } = useOfferContext();
  const { supabase } = useSupabase();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { data: offer, isLoading: offerLoading } = useOfferStatus(car?.id, user?.id);
  const offerStatus = offer?.status || 'none';
  const offerAmount = offer?.amount || null;
  const { openSignInModal } = useAuthModal();
  const { toast } = useToast();
  const [offerAmountState, setOfferAmountState] = useState<number | null>(null);

  // Remove useEffect and offerStatus/offerAmount state logic

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
    
    // Mark offer as made in context
    makeOffer(car.id);
    
    // UI feedback only, do not set offerStatus directly
    toast({
      title: "Offer submitted!",
      description: "Your offer has been sent to the seller.",
    });
    setShowOfferModal(false);
  };

  const handleChatClick = async () => {
    if (offerStatus === 'accepted') {
      try {
        await navigateToChat(car.id, user.id, car.seller.id, toast);
        await queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
      } catch (err) {
        toast({ title: 'Failed to open chat', description: err.message, variant: 'destructive' });
      }
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
    openSignInModal();
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
        toast({
          title: "Error",
          description: "Failed to mark car as sold. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Invalidate React Query cache to refresh UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['cars'] }),
        queryClient.invalidateQueries({ queryKey: ['userListings'] }),
        queryClient.invalidateQueries({ queryKey: ['receivedOffers'] })
      ]);
      
      toast({
        title: "Car Marked as Sold! ✅",
        description: "Your car has been marked as sold successfully.",
      });
      
      // Navigate back to profile
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCall = () => {
    if (offerStatus === 'accepted' && car.seller.phone) {
      if (window.confirm(`Call ${car.seller.name} at ${car.seller.phone}?`)) {
        window.location.href = `tel:${car.seller.phone}`;
      }
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
  );
};

export default CarDetailContainer;
