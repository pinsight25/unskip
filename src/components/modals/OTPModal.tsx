import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, CheckCircle } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phoneNumber: string;
  purpose: string;
}

const OTPModal = ({ isOpen, onClose, onSuccess, phoneNumber, purpose }: OTPModalProps) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    setError('');
    
    // Mock OTP verification - in real app, this would call an API
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
    setOtp('');
    setIsVerified(false);
    setError('');
    setIsVerifying(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
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
          {/* Phone Number Display */}
          <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{phoneNumber}</span>
            <Badge variant="outline" className="ml-auto">
              OTP Sent
            </Badge>
          </div>

          {/* Demo Notice */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <p className="text-sm text-accent-foreground">
              <strong>Demo Mode:</strong> Use OTP <code className="bg-accent/20 px-1 rounded">123456</code> to verify
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
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPModal;