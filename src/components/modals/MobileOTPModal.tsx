
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, User, CheckCircle } from 'lucide-react';
import { useOTPAuth } from '@/hooks/useOTPAuth';

import MobilePhoneStep from './mobile/MobilePhoneStep';
import MobileOTPStep from './mobile/MobileOTPStep';
import MobileProfileStep from './mobile/MobileProfileStep';

interface MobileOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phoneNumber: string;
  purpose: string;
}

const MobileOTPModal = ({ isOpen, onClose, onSuccess, phoneNumber: initialPhone, purpose }: MobileOTPModalProps) => {
  const {
    step,
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isVerifying,
    isSendingOTP,
    isVerified,
    error,
    profileData,
    setProfileData,
    isSaving,
    handleSendOTP,
    handleVerifyOTP,
    handleCompleteProfile,
    resetModal,
    editPhoneNumber
  } = useOTPAuth();

  // Initialize with provided phone number
  React.useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone);
    }
  }, [initialPhone, setPhoneNumber]);

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleOTPVerification = async () => {
    const result = await handleVerifyOTP();
    if (result?.isExistingUser) {
      setTimeout(() => {
        onSuccess();
        onClose();
        resetModal();
      }, 1500);
    }
  };

  const handleProfileCompletion = async () => {
    const result = await handleCompleteProfile();
    if (result?.success) {
      onSuccess();
      onClose();
      resetModal();
    }
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
            <p className="text-muted-foreground text-lg">Setting up your profile...</p>
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
              {step === 'profile' ? <User className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-primary" />}
            </div>
            <DialogTitle className="text-lg">
              {step === 'profile' ? 'Complete Your Profile' : 'Verify Your Phone'}
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {step === 'profile' 
              ? 'Just a few details to get started'
              : `To ensure safe transactions, we need to verify your phone number before you can ${purpose}.`
            }
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'phone' && (
            <MobilePhoneStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSendOTP={handleSendOTP}
              error={error}
              isSendingOTP={isSendingOTP}
            />
          )}

          {step === 'otp' && (
            <MobileOTPStep
              phoneNumber={phoneNumber}
              otp={otp}
              setOtp={setOtp}
              onVerifyOTP={handleOTPVerification}
              onEditPhone={editPhoneNumber}
              onResendOTP={handleSendOTP}
              error={error}
              isVerifying={isVerifying}
              isSendingOTP={isSendingOTP}
            />
          )}

          {step === 'profile' && (
            <MobileProfileStep
              profileData={profileData}
              setProfileData={setProfileData}
              onCompleteProfile={handleProfileCompletion}
              onCancel={handleClose}
              error={error}
              isSaving={isSaving}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileOTPModal;
