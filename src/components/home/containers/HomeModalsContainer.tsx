
import TestDriveModal from '@/components/modals/TestDriveModal';
import HomeModals from '@/components/home/HomeModals';
import { Car } from '@/types/car';

interface HomeModalsContainerProps {
  // Home modals props
  selectedCar: any;
  showOfferModal: boolean;
  showOTPModal: boolean;
  isMobile: boolean;
  onCloseOfferModal: () => void;
  onCloseOTPModal: () => void;
  onOTPSuccess: () => void;
  onOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
  
  // Test drive modal props
  testDriveSelectedCar: Car | null;
  showTestDriveModal: boolean;
  onCloseTestDriveModal: () => void;
  onTestDriveScheduled: (booking: any) => void;
}

const HomeModalsContainer = ({
  selectedCar,
  showOfferModal,
  showOTPModal,
  isMobile,
  onCloseOfferModal,
  onCloseOTPModal,
  onOTPSuccess,
  onOfferSubmit,
  testDriveSelectedCar,
  showTestDriveModal,
  onCloseTestDriveModal,
  onTestDriveScheduled
}: HomeModalsContainerProps) => {
  return (
    <>
      <HomeModals
        selectedCar={selectedCar}
        showOfferModal={showOfferModal}
        showOTPModal={showOTPModal}
        isMobile={isMobile}
        onCloseOfferModal={onCloseOfferModal}
        onCloseOTPModal={onCloseOTPModal}
        onOTPSuccess={onOTPSuccess}
        onOfferSubmit={onOfferSubmit}
      />

      {testDriveSelectedCar && (
        <TestDriveModal
          isOpen={showTestDriveModal}
          onClose={onCloseTestDriveModal}
          car={testDriveSelectedCar}
          onScheduled={onTestDriveScheduled}
        />
      )}
    </>
  );
};

export default HomeModalsContainer;
