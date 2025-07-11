
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Car } from '@/types/car';

interface TestDriveHandlers {
  showTestDriveModal: boolean;
  testDriveSelectedCar: Car | null;
  handleTestDriveClick: (car: any) => void;
  handleTestDriveScheduled: (booking: any) => void;
  setShowTestDriveModal: (show: boolean) => void;
  setTestDriveSelectedCar: (car: Car | null) => void;
}

interface UseHomeTestDriveHandlersProps {
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

export const useHomeTestDriveHandlers = ({ getOfferStatus }: UseHomeTestDriveHandlersProps): TestDriveHandlers => {
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveSelectedCar, setTestDriveSelectedCar] = useState<Car | null>(null);
  const { toast } = useToast();

  const handleTestDriveClick = (car: any) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer first to schedule a test drive.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Wait for seller response",
        description: "Please wait for the seller to respond to your offer before scheduling a test drive.",
      });
      return;
    }
    
    if (status === 'accepted') {
      setTestDriveSelectedCar(car);
      setShowTestDriveModal(true);
    }
    
    if (status === 'rejected') {
      toast({
        title: "Offer was rejected",
        description: "Please make a new offer before scheduling a test drive.",
        variant: "destructive",
      });
    }
  };

  const handleTestDriveScheduled = (booking: any) => {
    toast({
      title: "Test Drive Scheduled!",
      description: `Test drive scheduled for ${booking.date} at ${booking.timeSlot}`,
    });
    setShowTestDriveModal(false);
    setTestDriveSelectedCar(null);
  };

  return {
    showTestDriveModal,
    testDriveSelectedCar,
    handleTestDriveClick,
    handleTestDriveScheduled,
    setShowTestDriveModal,
    setTestDriveSelectedCar
  };
};
