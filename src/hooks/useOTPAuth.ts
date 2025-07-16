
import { useOTPState } from './otp/useOTPState';
import { useOTPHandlers } from './otp/useOTPHandlers';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';

interface UseOTPAuthProps {
  onClose?: () => void;
}

export const useOTPAuth = (props?: UseOTPAuthProps) => {
  const {
    step,
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isVerifying,
    setIsVerifying,
    isSendingOTP,
    setIsSendingOTP,
    isVerified,
    setIsVerified,
    error,
    setError,
    existingUser,
    setExistingUser,
    profileData,
    setProfileData,
    isSaving,
    setIsSaving,
    resetModal,
    editPhoneNumber,
    setStep
  } = useOTPState();

  const {
    handleSendOTP,
    handleVerifyOTP,
    handleCompleteProfile
  } = useOTPHandlers({
    phoneNumber,
    otp,
    profileData,
    setError,
    setIsSendingOTP,
    setStep,
    setIsVerifying,
    setExistingUser,
    setIsVerified,
    setIsSaving,
    onClose: props?.onClose,
    resetModal
  });

  return {
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
    editPhoneNumber,
    setStep // explicitly include setStep
  };
};
