
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Phone, Edit, Loader } from 'lucide-react';

interface OTPVerificationStepProps {
  phoneNumber: string;
  otp: string;
  onOtpChange: (otp: string) => void;
  onVerifyOTP: () => void;
  onEditPhone: () => void;
  error: string;
  isVerifying: boolean;
}

const OTPVerificationStep = ({
  phoneNumber,
  otp,
  onOtpChange,
  onVerifyOTP,
  onEditPhone,
  error,
  isVerifying
}: OTPVerificationStepProps) => {
  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 flex items-center space-x-3">
        <Phone className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium flex-1 text-gray-700">{phoneNumber}</span>
        <Button variant="ghost" size="sm" onClick={onEditPhone} className="h-8 w-8 p-0 rounded-full">
          <Edit className="h-4 w-4" />
        </Button>
        <Badge className="bg-green-100 text-green-700 border-green-200">
          OTP Sent
        </Badge>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
        <p className="text-sm text-green-800 font-medium text-center">
          <strong>🔥 Demo Mode:</strong> Use OTP <code className="bg-green-200 px-3 py-1 rounded-lg text-lg font-bold mx-2">123456</code>
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <label className="text-sm font-semibold text-gray-700 block mb-3">Enter 6-digit OTP</label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={onOtpChange}
            className="justify-center"
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onEditPhone} className="flex-1 h-12 rounded-2xl border-2">
          Edit Phone
        </Button>
        <Button 
          onClick={onVerifyOTP} 
          disabled={otp.length !== 6 || isVerifying}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
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
      </div>

      <div className="text-center">
        <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-primary">
          Didn't receive OTP? Resend in 30s
        </Button>
      </div>
    </>
  );
};

export default OTPVerificationStep;
