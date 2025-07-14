
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PhoneVerificationStep from './otp/PhoneVerificationStep';
import OTPVerificationStep from './otp/OTPVerificationStep';
import VerificationSuccessStep from './otp/VerificationSuccessStep';
import OTPModalHeader from './otp/OTPModalHeader';

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
    return <VerificationSuccessStep isOpen={isOpen} onClose={handleClose} />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
        <DialogHeader>
          <DialogTitle>Verify Your Phone</DialogTitle>
          <DialogDescription>Enter the OTP sent to your phone.</DialogDescription>
        </DialogHeader>
        <OTPModalHeader purpose={purpose} />

        <div className="space-y-6 p-2">
          {step === 'phone' ? (
            <PhoneVerificationStep
              phoneNumber={phoneNumber}
              onPhoneChange={setPhoneNumber}
              onSendOTP={handleSendOTP}
              onCancel={handleClose}
              error={error}
              phoneDigits={phoneDigits}
            />
          ) : (
            <OTPVerificationStep
              phoneNumber={phoneNumber}
              otp={otp}
              onOtpChange={setOtp}
              onVerifyOTP={handleVerifyOTP}
              onEditPhone={editPhoneNumber}
              error={error}
              isVerifying={isVerifying}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPModal;
