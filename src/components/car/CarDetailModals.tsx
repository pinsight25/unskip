
import { Car } from '@/types/car';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import TestDriveModal from '@/components/modals/TestDriveModal';

interface CarDetailModalsProps {
  car: Car;
  showOfferModal: boolean;
  showOTPModal: boolean;
  showTestDriveModal: boolean;
  onCloseOfferModal: () => void;
  onCloseOTPModal: () => void;
  onCloseTestDriveModal: () => void;
  onOTPSuccess: () => void;
  onOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
  onTestDriveScheduled: (booking: any) => void;
}

const CarDetailModals = ({
  car,
  showOfferModal,
  showOTPModal,
  showTestDriveModal,
  onCloseOfferModal,
  onCloseOTPModal,
  onCloseTestDriveModal,
  onOTPSuccess,
  onOfferSubmit,
  onTestDriveScheduled
}: CarDetailModalsProps) => {
  return (
    <>
      <OfferModal
        isOpen={showOfferModal}
        onClose={onCloseOfferModal}
        car={car}
        onSubmit={onOfferSubmit}
      />

      <OTPModal
        isOpen={showOTPModal}
        onClose={onCloseOTPModal}
        onSuccess={onOTPSuccess}
        phoneNumber="+91 98765 43210"
        purpose="make an offer"
      />

      <TestDriveModal
        isOpen={showTestDriveModal}
        onClose={onCloseTestDriveModal}
        car={car}
        onScheduled={onTestDriveScheduled}
      />
    </>
  );
};

export default CarDetailModals;
