
import { Input } from '@/components/ui/input';
import { IndianRupee } from 'lucide-react';
import { PricingAlert } from '@/types/car';
import PricingAlertDisplay from './PricingAlertDisplay';

interface OfferAmountSectionProps {
  offerAmount: string;
  pricingAlert: PricingAlert | null;
  onOfferAmountChange: (value: string) => void;
}

const OfferAmountSection = ({
  offerAmount,
  pricingAlert,
  onOfferAmountChange
}: OfferAmountSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold mb-2 block text-gray-700">Your Offer Amount *</label>
        <div className="relative">
          <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Enter your offer amount"
            value={offerAmount}
            onChange={(e) => onOfferAmountChange(e.target.value)}
            className="pl-12 h-14 text-lg font-semibold border-2 rounded-xl"
          />
        </div>
      </div>

      {pricingAlert && <PricingAlertDisplay pricingAlert={pricingAlert} />}
    </div>
  );
};

export default OfferAmountSection;
