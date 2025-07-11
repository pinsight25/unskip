
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Edit, Loader, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OTPVerificationStepProps {
  phoneNumber: string;
  otp: string;
  setOtp: (otp: string) => void;
  onVerifyOTP: () => void;
  onEditPhone: () => void;
  onResendOTP: () => void;
  error: string;
  isVerifying: boolean;
  isSendingOTP: boolean;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
}

const OTPVerificationStep = ({
  phoneNumber,
  otp,
  setOtp,
  onVerifyOTP,
  onEditPhone,
  onResendOTP,
  error,
  isVerifying,
  isSendingOTP,
  termsAccepted,
  onTermsChange
}: OTPVerificationStepProps) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const isTimeoutError = error.includes('timeout') || error.includes('taking too long');

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

      <div className="space-y-4">
        <div className="text-center">
          <label className="text-sm font-semibold text-gray-700 block mb-3">Enter 6-digit OTP</label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
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

        <div className="flex items-start space-x-3 py-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={onTermsChange}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
            I agree to the{' '}
            <Link to="/terms" className="text-orange-600 hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-orange-600 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {error && (
          <div className="text-sm text-red-500 text-center bg-red-50 py-3 px-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Verification Error</span>
            </div>
            <p className="text-red-600 mb-3">{error}</p>
            
            {isTimeoutError && (
              <div className="space-y-2">
                <p className="text-xs text-red-500">Try these solutions:</p>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    className="text-xs border-red-200 hover:bg-red-50"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh Page
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onResendOTP}
                    disabled={isSendingOTP}
                    className="text-xs border-red-200 hover:bg-red-50"
                  >
                    {isSendingOTP ? 'Sending...' : 'Resend OTP'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onEditPhone} className="flex-1 h-12 rounded-2xl border-2">
          Edit Phone
        </Button>
        <Button 
          onClick={onVerifyOTP} 
          disabled={otp.length !== 6 || isVerifying || !termsAccepted}
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
        <Button variant="ghost" size="sm" onClick={onResendOTP} disabled={isSendingOTP} className="text-xs text-gray-500 hover:text-primary">
          {isSendingOTP ? 'Sending...' : 'Didn\'t receive OTP? Resend'}
        </Button>
      </div>
    </>
  );
};

export default OTPVerificationStep;
