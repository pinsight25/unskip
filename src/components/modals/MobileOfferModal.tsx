
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';
import { PricingAlert } from '@/types/car';
import { X, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        message: 'This offer is significantly below market value and cannot be submitted.',
        percentageDiff
      };
    } else if (percentageDiff >= 20) {
      return {
        type: 'warning',
        message: `Seller typically expects ₹${formatPrice(Math.floor(askingPrice * 0.8))} - ₹${formatPrice(askingPrice)}`,
        percentageDiff
      };
    } else {
      return {
        type: 'fair',
        message: '✅ Great offer!',
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
        title: "Offer Submitted Successfully!",
        description: "Your offer has been sent to the seller. They will contact you if interested.",
      });
      
      setOfferAmount('');
      setMessage('');
      setBuyerName('');
      setBuyerPhone('');
      setPricingAlert(null);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price);
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
      <DialogContent className="sm:max-w-full sm:h-full sm:max-h-screen p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Make an Offer</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Car Summary */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
            <img 
              src={car.images[0]} 
              alt={car.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{car.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xl font-bold text-primary">
                  ₹{formatPrice(car.price)}
                </span>
                <Badge variant="outline" className="text-xs">Asking Price</Badge>
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Name *</label>
              <Input
                placeholder="Full name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number *</label>
              <Input
                placeholder="+91 98765 43210"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="h-12 text-base"
                inputMode="tel"
              />
            </div>
          </div>

          {/* Offer Amount */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Offer Amount *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">₹</span>
              <Input
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => handleOfferAmountChange(e.target.value)}
                className="pl-10 h-14 text-lg font-semibold"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Pricing Alert */}
          {pricingAlert && (
            <Alert className={`${
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
                  <AlertDescription className={`${
                    pricingAlert.type === 'blocked' 
                      ? 'text-red-800' 
                      : pricingAlert.type === 'warning'
                      ? 'text-orange-800'
                      : 'text-green-800'
                  } font-medium`}>
                    {pricingAlert.message}
                  </AlertDescription>
                  {pricingAlert.percentageDiff > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Your offer is {pricingAlert.percentageDiff.toFixed(1)}% below asking price
                    </p>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
            <Textarea
              placeholder="Add a personal message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white space-y-3">
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="w-full h-12 text-base font-semibold bg-primary"
          >
            {isSubmitting ? 'Sending Offer...' : (
              <>
                <DollarSign className="h-5 w-5 mr-2" />
                Send Offer
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By submitting an offer, you agree to our terms and conditions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileOfferModal;
