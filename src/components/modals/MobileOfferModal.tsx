
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';
import { PricingAlert } from '@/types/car';
import { IndianRupee, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatIndianPrice } from '@/utils/priceFormatter';

interface MobileOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  onSubmit: (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => void;
}

const MobileOfferModal = ({ isOpen, onClose, car, onSubmit }: MobileOfferModalProps) => {
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [pricingAlert, setPricingAlert] = useState<PricingAlert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        description: "Your offer has been sent to the seller.",
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

  const isFormValid = () => {
    const numericAmount = parseInt(offerAmount.replace(/,/g, ''));
    return (
      numericAmount > 0 &&
      buyerName.trim() &&
      buyerPhone.trim() &&
      pricingAlert?.type !== 'blocked'
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-sm:m-4 max-sm:max-w-[calc(100vw-2rem)] max-sm:max-h-[90vh] max-sm:overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">Make an Offer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Car Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 flex items-center space-x-3">
            <img 
              src={car.images[0]} 
              alt={car.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">{car.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-primary">
                  {formatIndianPrice(car.price)}
                </span>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-xs">
                  Asking Price
                </Badge>
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold mb-1 block text-gray-700">Your Name *</label>
              <Input
                placeholder="Full name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="h-10 text-sm border-2 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block text-gray-700">Phone Number *</label>
              <Input
                placeholder="+91 98765 43210"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="h-10 text-sm border-2 rounded-lg"
                inputMode="tel"
              />
            </div>
          </div>

          {/* Offer Amount */}
          <div>
            <label className="text-sm font-semibold mb-1 block text-gray-700">Your Offer Amount *</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => handleOfferAmountChange(e.target.value)}
                className="pl-11 h-12 text-lg font-semibold border-2 rounded-lg"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Pricing Alert */}
          {pricingAlert && (
            <Alert className={`border-2 rounded-lg ${
              pricingAlert.type === 'blocked' 
                ? 'border-red-500 bg-red-50' 
                : pricingAlert.type === 'warning'
                ? 'border-orange-500 bg-orange-50'
                : 'border-green-500 bg-green-50'
            }`}>
              <div className="flex items-start space-x-2">
                {pricingAlert.type === 'blocked' && <X className="h-5 w-5 text-red-600 mt-0.5" />}
                {pricingAlert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />}
                {pricingAlert.type === 'fair' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                <div className="flex-1">
                  <AlertDescription className={`font-semibold text-sm ${
                    pricingAlert.type === 'blocked' 
                      ? 'text-red-800' 
                      : pricingAlert.type === 'warning'
                      ? 'text-orange-800'
                      : 'text-green-800'
                  }`}>
                    {pricingAlert.message}
                  </AlertDescription>
                  {pricingAlert.percentageDiff > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      Your offer is {pricingAlert.percentageDiff.toFixed(1)}% below asking price
                    </p>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {/* Message */}
          <div>
            <label className="text-sm font-semibold mb-1 block text-gray-700">Message (Optional)</label>
            <Textarea
              placeholder="Add a personal message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="text-sm border-2 rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 rounded-lg"
            >
              {isSubmitting ? 'Sending Offer...' : (
                <>
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Send Offer
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              By submitting an offer, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileOfferModal;
