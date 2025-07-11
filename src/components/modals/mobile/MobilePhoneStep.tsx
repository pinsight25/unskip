
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import { Phone, Loader } from 'lucide-react';

interface MobilePhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  onSendOTP: () => void;
  error: string;
  isSendingOTP: boolean;
}

const MobilePhoneStep = ({
  phoneNumber,
  setPhoneNumber,
  onSendOTP,
  error,
  isSendingOTP
}: MobilePhoneStepProps) => {
  const phoneDigits = phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '');

  return (
    <>
      <div className="space-y-4">
        <label className="text-base font-medium">Enter your phone number</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-20" />
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="pl-12 h-14 text-base"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
      <Button 
        onClick={onSendOTP} 
        disabled={phoneDigits.length < 10 || isSendingOTP}
        className="w-full h-12 text-base font-semibold"
      >
        {isSendingOTP ? (
          <>
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          'Send OTP'
        )}
      </Button>
    </>
  );
};

export default MobilePhoneStep;
