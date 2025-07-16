
import { Car } from '@/types/car';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';

interface HomeModalsProps {
  selectedCar: Car | null;
  showOfferModal: boolean;
  isMobile: boolean;
  onCloseOfferModal: () => void;
  onOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
  openSignInModal: () => void; // NEW PROP
}

const HomeModals = ({
  selectedCar,
  showOfferModal,
  isMobile,
  onCloseOfferModal,
  onOfferSubmit,
  openSignInModal
}: HomeModalsProps) => {
  useEffect(() => {
    console.log('[HomeModals] openSignInModal prop:', !!openSignInModal);
  }, [openSignInModal]);
  const { user } = useUser();

  if (!selectedCar) return null;

  // Use user's phone if signed in, otherwise use default
  const phoneNumber = user?.phone || '+91 98765 43210';

  return (
    <>
      {isMobile ? (
        <>
          {/* MobileOfferModal and MobileOTPModal are removed, so this block is now empty */}
        </>
      ) : (
        <>
          {/* OfferModal and OTPModal are removed, so this block is now empty */}
        </>
      )}
    </>
  );
};

export default HomeModals;
