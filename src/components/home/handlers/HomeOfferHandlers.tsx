
import { useOfferContext } from '@/contexts/OfferContext';
import { useToast } from '@/hooks/use-toast';

interface OfferHandlers {
  handleOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
}

interface UseHomeOfferHandlersProps {
  selectedCar: any;
  originalHandleOfferSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
}

export const useHomeOfferHandlers = ({ 
  selectedCar, 
  originalHandleOfferSubmit 
}: UseHomeOfferHandlersProps): OfferHandlers => {
  const { makeOffer } = useOfferContext();

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    if (selectedCar) {
      makeOffer(selectedCar.id);
    }
    originalHandleOfferSubmit(offer);
  };

  return {
    handleOfferSubmit
  };
};
