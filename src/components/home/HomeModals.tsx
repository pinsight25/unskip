
import { Car } from '@/types/car';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import MobileOfferModal from '@/components/modals/MobileOfferModal';
import MobileOTPModal from '@/components/modals/MobileOTPModal';
import { useUser } from '@/contexts/UserContext';

interface HomeModalsProps {
  selectedCar: Car | null;
  showOfferModal: boolean;
  showOTPModal: boolean;
  isMobile: boolean;
  onCloseOfferModal: () => void;
  onCloseOTPModal: () => void;
  onOTPSuccess: () => void;
  onOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
}

const HomeModals = ({
  selectedCar,
  showOfferModal,
  showOTPModal,
  isMobile,
  onCloseOfferModal,
  onCloseOTPModal,
  onOTPSuccess,
  onOfferSubmit
}: HomeModalsProps) => {
  const { user } = useUser();

  if (!selectedCar) return null;

  // Use user's phone if signed in, otherwise use default
  const phoneNumber = user?.phone || '+91 98765 43210';

  return (
    <>
      {isMobile ? (
        <>
          <MobileOfferModal
            isOpen={showOfferModal}
            onClose={onCloseOfferModal}
            car={selectedCar}
            onSubmit={onOfferSubmit}
          />
          <MobileOTPModal
            isOpen={showOTPModal}
            onClose={onCloseOTPModal}
            onSuccess={onOTPSuccess}
            phoneNumber={phoneNumber}
            purpose="make an offer"
          />
        </>
      ) : (
        <>
          <OfferModal
            isOpen={showOfferModal}
            onClose={onCloseOfferModal}
            car={selectedCar}
            onSubmit={onOfferSubmit}
          />
          <OTPModal
            isOpen={showOTPModal}
            onClose={onCloseOTPModal}
            onSuccess={onOTPSuccess}
            phoneNumber={phoneNumber}
            purpose="make an offer"
          />
        </>
      )}
    </>
  );
};

export default HomeModals;
