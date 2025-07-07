
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, CheckCircle, Edit } from 'lucide-react';

interface MobileOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phoneNumber: string;
  purpose: string;
}

const MobileOTPModal = ({ isOpen, onClose, onSuccess, phoneNumber: initialPhone, purpose }: MobileOTPModalProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
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
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Verification Successful!</h3>
            <p className="text-muted-foreground text-lg">You can now contact the seller.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg">Verify Your Phone</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            To ensure safe transactions, we need to verify your phone number before you can {purpose}.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-4">
                <label className="text-base font-medium">Enter your phone number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 h-14 text-base"
                    inputMode="tel"
                    maxLength={15}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>
              <Button 
                onClick={handleSendOTP} 
                disabled={phoneNumber.length < 10}
                className="w-full h-12 text-base font-semibold"
              >
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-medium flex-1">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={editPhoneNumber}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-white">
                  OTP Sent
                </Badge>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium text-center">
                  <strong>🔥 Demo Mode:</strong><br />
                  Use OTP <code className="bg-green-200 px-3 py-1 rounded text-xl font-bold">123456</code> to verify
                </p>
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
                <Button variant="ghost" size="sm" className="text-sm">
                  Didn't receive OTP? Resend
                </Button>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full h-12 text-base font-semibold"
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={editPhoneNumber} 
                  className="w-full h-12 text-base"
                >
                  Edit Phone Number
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileOTPModal;
