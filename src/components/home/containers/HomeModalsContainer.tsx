
import { Car } from '@/types/car';
import { useEffect } from 'react';

interface HomeModalsContainerProps {
  // Home modals props
  selectedCar: any;
  showOfferModal: boolean;
  isMobile: boolean;
  onCloseOfferModal: () => void;
  onOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
  openSignInModal: () => void; // NEW PROP
  
  // Test drive modal props
  testDriveSelectedCar: Car | null;
  showTestDriveModal: boolean;
  onCloseTestDriveModal: () => void;
  onTestDriveScheduled: (booking: any) => void;
}

const HomeModalsContainer = ({
  selectedCar,
  showOfferModal,
  isMobile,
  onCloseOfferModal,
  onOfferSubmit,
  testDriveSelectedCar,
  showTestDriveModal,
  onCloseTestDriveModal,
  onTestDriveScheduled,
  openSignInModal
}: HomeModalsContainerProps) => {
  useEffect(() => {
    console.log('[HomeModalsContainer] openSignInModal prop:', !!openSignInModal);
  }, [openSignInModal]);
  return (
    <>
      {/* The HomeModals component and its modal logic have been removed. */}
      {/* If SignInModal is needed, it should be handled globally or passed as a prop. */}
      {/* For now, this component is empty as the modals are removed. */}
    </>
  );
};

export default HomeModalsContainer;
