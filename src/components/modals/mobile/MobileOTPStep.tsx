
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Edit, Loader } from 'lucide-react';

interface MobileOTPStepProps {
  phoneNumber: string;
  otp: string;
  setOtp: (otp: string) => void;
  onVerifyOTP: () => void;
  onEditPhone: () => void;
  onResendOTP: () => void;
  error: string;
  isVerifying: boolean;
  isSendingOTP: boolean;
}

const MobileOTPStep = ({
  phoneNumber,
  otp,
  setOtp,
  onVerifyOTP,
  onEditPhone,
  onResendOTP,
  error,
  isVerifying,
  isSendingOTP
}: MobileOTPStepProps) => {
  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
        <Phone className="h-5 w-5 text-muted-foreground" />
        <span className="text-base font-medium flex-1">{phoneNumber}</span>
        <Button variant="ghost" size="sm" onClick={onEditPhone}>
          <Edit className="h-4 w-4" />
        </Button>
        <Badge variant="outline" className="bg-white">
          OTP Sent
        </Badge>
      </div>

      <div className="space-y-4">
        <label className="text-base font-medium">Enter 6-digit OTP</label>
        <Input
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="text-center text-2xl tracking-widest h-14"
          inputMode="numeric"
          maxLength={6}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="text-center">
        <Button variant="ghost" size="sm" className="text-sm" onClick={onResendOTP} disabled={isSendingOTP}>
          {isSendingOTP ? 'Sending...' : 'Didn\'t receive OTP? Resend'}
        </Button>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={onVerifyOTP} 
          disabled={otp.length !== 6 || isVerifying}
          className="w-full h-12 text-base font-semibold"
        >
          {isVerifying ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onEditPhone} 
          className="w-full h-12 text-base"
        >
          Edit Phone Number
        </Button>
      </div>
    </>
  );
};

export default MobileOTPStep;
