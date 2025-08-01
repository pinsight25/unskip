
import { useState } from 'react';
import { Car } from '@/types/car';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useOfferFlow = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const handleMakeOffer = (car: Car) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make an offer",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedCar(car);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: {
    amount: number;
    message: string;
    buyerName: string;
    buyerPhone: string;
  }) => {
    // Handle offer submission logic
    console.log('Offer submitted:', offer);
    toast({
      title: "Offer submitted",
      description: "Your offer has been sent to the seller",
    });
    closeModals();
  };

  const closeModals = () => {
    setShowOfferModal(false);
    setSelectedCar(null);
  };

  return {
    selectedCar,
    showOfferModal,
    handleMakeOffer,
    handleOfferSubmit,
    closeModals,
    setShowOfferModal
  };
};
