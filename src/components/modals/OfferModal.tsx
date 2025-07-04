
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';
import { PricingAlert } from '@/types/car';
import { AlertTriangle, DollarSign, TrendingDown, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue) {
      // Format with thousand separators
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
    
    // Simulate API call
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
      
      // Reset form
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Submit your best offer for {car.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Car Summary */}
          <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-4">
            <img 
              src={car.images[0]} 
              alt={car.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{car.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-primary">
                  ₹{formatPrice(car.price)}
                </span>
                <Badge variant="outline">Asking Price</Badge>
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Your Name *</label>
              <Input
                placeholder="Full name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone Number *</label>
              <Input
                placeholder="+91 98765 43210"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Offer Amount */}
          <div>
            <label className="text-sm font-medium mb-1 block">Your Offer Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => handleOfferAmountChange(e.target.value)}
                className="pl-8 text-lg font-semibold"
              />
            </div>
          </div>

          {/* Pricing Alert */}
          {pricingAlert && (
            <Alert className={`${
              pricingAlert.type === 'blocked' 
                ? 'border-destructive bg-destructive/5' 
                : pricingAlert.type === 'warning'
                ? 'border-orange-500 bg-orange-50'
                : 'border-green-500 bg-green-50'
            }`}>
              <div className="flex items-start space-x-2">
                {pricingAlert.type === 'blocked' && <X className="h-4 w-4 text-destructive mt-0.5" />}
                {pricingAlert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />}
                {pricingAlert.type === 'fair' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                <div className="flex-1">
                  <AlertDescription className={`${
                    pricingAlert.type === 'blocked' 
                      ? 'text-destructive' 
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
            <label className="text-sm font-medium mb-1 block">Message (Optional)</label>
            <Textarea
              placeholder="Add a personal message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="flex-1 bg-gradient-primary"
            >
              {isSubmitting ? 'Sending...' : 'Send Offer'}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground">
            By submitting an offer, you agree to our terms and conditions. 
            Your contact information will be shared with the seller if they accept your offer.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferModal;
