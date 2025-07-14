
import { Car } from '@/types/car';
import MakeOfferModal from '@/components/car-details/MakeOfferModal';
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
      <MakeOfferModal
        isOpen={showOfferModal}
        onClose={onCloseOfferModal}
        car={{
          id: car.id,
          title: car.title,
          price: car.price,
          images: (car.images || []).map(url => ({ url })),
          seller_id: car.seller.id,
        }}
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
