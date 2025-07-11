
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Car } from '@/types/car';
import { PricingAlert } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { formatIndianPrice } from '@/utils/priceFormatter';
import OfferModalHeader from './offer/OfferModalHeader';
import BuyerInformationSection from './offer/BuyerInformationSection';
import OfferAmountSection from './offer/OfferAmountSection';
import MessageSection from './offer/MessageSection';
import OfferModalActions from './offer/OfferModalActions';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  onSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
}

const OfferModal = ({ isOpen, onClose, car, onSubmit }: OfferModalProps) => {
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('+91 ');
  const [pricingAlert, setPricingAlert] = useState<PricingAlert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // SMART OFFER VALIDATION - AS REQUESTED
  const calculatePricingAlert = (offerAmount: number): PricingAlert => {
    const askingPrice = car.price;
    const percentageDiff = ((askingPrice - offerAmount) / askingPrice) * 100;

    if (percentageDiff >= 40) {
      return {
        type: 'blocked',
        message: 'Please make a fair offer. This is too low for the seller to consider.',
        percentageDiff
      };
    } else if (percentageDiff >= 20) {
      return {
        type: 'warning',
        message: `Seller expects ${formatIndianPrice(Math.floor(askingPrice * 0.8))} - ${formatIndianPrice(askingPrice)}`,
        percentageDiff
      };
    } else {
      return {
        type: 'fair',
        message: '✅ Great offer! Seller is likely to respond positively.',
        percentageDiff
      };
    }
  };

  const handleOfferAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue) {
      const formatted = parseInt(numericValue).toLocaleString('en-IN');
      setOfferAmount(formatted);
      
      const alert = calculatePricingAlert(parseInt(numericValue));
      setPricingAlert(alert);
    } else {
      setOfferAmount('');
      setPricingAlert(null);
    }
  };

  const handleSubmit = async () => {
    const numericAmount = parseInt(offerAmount.replace(/,/g, ''));
    
    if (pricingAlert?.type === 'blocked') {
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit({
        amount: numericAmount,
        message,
        buyerName,
        buyerPhone
      });
      
      toast({
        title: "Offer Submitted Successfully! 🎉",
        description: "Your offer has been sent to the seller. They will contact you if interested.",
      });
      
      resetForm();
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setOfferAmount('');
    setMessage('');
    setBuyerName('');
    setBuyerPhone('');
    setPricingAlert(null);
  };

  const phoneDigits = buyerPhone.replace(/^\+91\s?/, '').replace(/\D/g, '');

  const isFormValid = () => {
    const numericAmount = parseInt(offerAmount.replace(/,/g, ''));
    return (
      numericAmount > 0 &&
      buyerName.trim() &&
      phoneDigits.length === 10 &&
      pricingAlert?.type !== 'blocked'
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl bg-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Make an Offer</DialogTitle>
          <DialogDescription>
            Submit your best offer for {car.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <OfferModalHeader car={car} />

          <BuyerInformationSection
            buyerName={buyerName}
            buyerPhone={buyerPhone}
            onBuyerNameChange={setBuyerName}
            onBuyerPhoneChange={setBuyerPhone}
          />

          <OfferAmountSection
            offerAmount={offerAmount}
            pricingAlert={pricingAlert}
            onOfferAmountChange={handleOfferAmountChange}
          />

          <MessageSection
            message={message}
            onMessageChange={setMessage}
          />

          <OfferModalActions
            isFormValid={isFormValid()}
            isSubmitting={isSubmitting}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferModal;
