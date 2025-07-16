
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Car } from '@/types/car';

export const useOfferFlow = () => {
  const { isSignedIn } = useUser();
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleMakeOffer = (car: Car) => {
    setSelectedCar(car);
    if (isSignedIn) {
      // Skip OTP for signed-in users
      setShowOfferModal(true);
    } else {
      // Show OTP modal first for non-signed-in users
      // This logic is removed as per the edit hint.
    }
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    // Handle offer submission logic here
    console.log('Offer submitted:', offer);
    setShowOfferModal(false);
    setSelectedCar(null);
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
