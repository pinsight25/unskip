
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, CheckCircle, Edit } from 'lucide-react';

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
    
    // Mock OTP verification
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
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verification Successful!</h3>
            <p className="text-muted-foreground">You can now contact the seller.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>Verify Your Phone Number</DialogTitle>
          </div>
          <DialogDescription>
            To ensure safe transactions, we need to verify your phone number before you can {purpose}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'phone' ? (
            <>
              {/* Phone Number Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter your phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={15}
                    className="pl-10"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendOTP} 
                  disabled={phoneNumber.length < 10}
                  className="flex-1 bg-gradient-primary"
                >
                  Send OTP
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Phone Number Display with Edit Option */}
              <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={editPhoneNumber}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="ml-auto">
                  OTP Sent
                </Badge>
              </div>

              {/* Demo Notice - More Prominent */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium text-center">
                  <strong>🔥 Demo Mode:</strong> Use OTP <code className="bg-green-200 px-2 py-1 rounded text-lg font-bold">123456</code> to verify
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter 6-digit OTP</label>
                <Input
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={editPhoneNumber} className="flex-1">
                  Edit Phone
                </Button>
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otp.length !== 6 || isVerifying}
                  className="flex-1 bg-gradient-primary"
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  Didn't receive OTP? Resend
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
