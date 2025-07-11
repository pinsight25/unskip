
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield, User } from 'lucide-react';
import { useOTPAuth } from '@/hooks/useOTPAuth';

import PhoneInputStep from './signin/PhoneInputStep';
import OTPVerificationStep from './signin/OTPVerificationStep';
import ProfileCompletionStep from './signin/ProfileCompletionStep';
import VerificationSuccessModal from './signin/VerificationSuccessModal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [termsAccepted, setTermsAccepted] = useState(true);
  
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
    setError,
    existingUser,
    profileData,
    setProfileData,
    isSaving,
    handleSendOTP,
    handleVerifyOTP,
    handleCompleteProfile,
    resetModal,
    editPhoneNumber
  } = useOTPAuth();

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (error && checked) {
      setError('');
    }
  };

  const handleOTPVerification = async () => {
    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }

    const result = await handleVerifyOTP();
    if (result?.isExistingUser) {
      setTimeout(() => {
        onClose();
        resetModal();
      }, 1500);
    }
  };

  const handleProfileCompletion = async () => {
    const result = await handleCompleteProfile();
    if (result?.success) {
      onClose();
      resetModal();
    }
  };

  if (isVerified) {
    return (
      <VerificationSuccessModal 
        isOpen={isOpen}
        onClose={handleClose}
        existingUser={existingUser}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
        <DialogHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              {step === 'profile' ? <User className="h-6 w-6 text-white" /> : <Shield className="h-6 w-6 text-white" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {step === 'profile' ? 'Complete Your Profile' : 'Verify Phone'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {step === 'profile' ? 'Just a few details to get started' : 'Secure verification to sign in to your account'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {step === 'phone' && (
            <PhoneInputStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSendOTP={handleSendOTP}
              onCancel={handleClose}
              error={error}
              isSendingOTP={isSendingOTP}
            />
          )}

          {step === 'otp' && (
            <OTPVerificationStep
              phoneNumber={phoneNumber}
              otp={otp}
              setOtp={setOtp}
              onVerifyOTP={handleOTPVerification}
              onEditPhone={editPhoneNumber}
              onResendOTP={handleSendOTP}
              error={error}
              isVerifying={isVerifying}
              isSendingOTP={isSendingOTP}
              termsAccepted={termsAccepted}
              onTermsChange={handleTermsChange}
            />
          )}

          {step === 'profile' && (
            <ProfileCompletionStep
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

export default SignInModal;
