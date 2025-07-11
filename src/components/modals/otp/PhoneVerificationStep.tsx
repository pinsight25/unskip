
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';

interface PhoneVerificationStepProps {
  phoneNumber: string;
  onPhoneChange: (phone: string) => void;
  onSendOTP: () => void;
  onCancel: () => void;
  error: string;
  phoneDigits: string;
}

const PhoneVerificationStep = ({
  phoneNumber,
  onPhoneChange,
  onSendOTP,
  onCancel,
  error,
  phoneDigits
}: PhoneVerificationStepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <PhoneInput
            value={phoneNumber}
            onChange={onPhoneChange}
            className="py-4 border-2 border-gray-100 rounded-2xl focus:border-primary focus:outline-none transition-colors text-lg"
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-2xl border-2">
          Cancel
        </Button>
        <Button 
          onClick={onSendOTP} 
          disabled={phoneDigits.length < 10}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
        >
          Send OTP
        </Button>
      </div>
    </>
  );
};

export default PhoneVerificationStep;
