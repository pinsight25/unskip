
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { PhoneInput } from '@/components/ui/phone-input';
import { Shield, Phone, CheckCircle, Edit, Loader } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phoneNumber: string;
  purpose: string;
}

const OTPModal = ({ isOpen, onClose, onSuccess, phoneNumber: initialPhone, purpose }: OTPModalProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const phoneDigits = phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '');

  const handleSendOTP = () => {
    if (phoneDigits.length >= 10) {
      setStep('otp');
      setError('');
    } else {
      setError('Please enter a valid phone number');
    }
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    setError('');
    
    setTimeout(() => {
      if (otp === '123456') {
        setIsVerified(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          resetModal();
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber(initialPhone);
    setOtp('');
    setIsVerified(false);
    setError('');
    setIsVerifying(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const editPhoneNumber = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  if (isVerified) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Verification Successful!</h3>
            <p className="text-gray-600">You can now contact the seller.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
        <DialogHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Verify Phone</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Secure verification to {purpose}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {step === 'phone' ? (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="py-4 border-2 border-gray-100 rounded-2xl focus:border-primary focus:outline-none transition-colors text-lg"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 h-12 rounded-2xl border-2">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendOTP} 
                  disabled={phoneDigits.length < 10}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
                >
                  Send OTP
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium flex-1 text-gray-700">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={editPhoneNumber} className="h-8 w-8 p-0 rounded-full">
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
                {error && (
                  <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={editPhoneNumber} className="flex-1 h-12 rounded-2xl border-2">
                  Edit Phone
                </Button>
                <Button 
                  onClick={handleVerifyOTP} 
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPModal;
