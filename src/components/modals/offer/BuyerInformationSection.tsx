
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';

interface BuyerInformationSectionProps {
  buyerName: string;
  buyerPhone: string;
  onBuyerNameChange: (value: string) => void;
  onBuyerPhoneChange: (value: string) => void;
}

const BuyerInformationSection = ({
  buyerName,
  buyerPhone,
  onBuyerNameChange,
  onBuyerPhoneChange
}: BuyerInformationSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-semibold mb-2 block text-gray-700">Your Name *</label>
        <Input
          placeholder="Full name"
          value={buyerName}
          onChange={(e) => onBuyerNameChange(e.target.value)}
          className="h-12 border-2 rounded-xl"
        />
      </div>
      <div>
        <label className="text-sm font-semibold mb-2 block text-gray-700">Phone Number *</label>
        <PhoneInput
          value={buyerPhone}
          onChange={onBuyerPhoneChange}
          className="h-12 border-2 rounded-xl"
        />
      </div>
    </div>
  );
};

export default BuyerInformationSection;
