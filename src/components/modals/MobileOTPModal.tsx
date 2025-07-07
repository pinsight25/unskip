
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
        <DialogContent className="max-w-sm mx-auto max-sm:m-4 max-sm:max-w-[calc(100vw-2rem)] max-sm:max-h-[80vh]">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Verification Successful!</h3>
            <p className="text-muted-foreground">You can now contact the seller.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto max-sm:m-4 max-sm:max-w-[calc(100vw-2rem)] max-sm:max-h-[85vh] max-sm:overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-base font-semibold">Verify Your Phone</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            To ensure safe transactions, we need to verify your phone number before you can {purpose}.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {step === 'phone' ? (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium">Enter your phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 h-11 text-sm"
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
                className="w-full h-11 text-sm font-semibold"
              >
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={editPhoneNumber} className="h-8 w-8 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Badge variant="outline" className="bg-white text-xs">
                  OTP Sent
                </Badge>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                <p className="text-green-800 font-medium text-center text-sm">
                  <strong>🔥 Demo Mode:</strong><br />
                  Use OTP <code className="bg-green-200 px-2 py-1 rounded text-base font-bold">123456</code> to verify
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Enter 6-digit OTP</label>
                <Input
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-widest h-12"
                  inputMode="numeric"
                  maxLength={6}
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  Didn't receive OTP? Resend
                </Button>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full h-11 text-sm font-semibold"
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={editPhoneNumber} 
                  className="w-full h-11 text-sm"
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
