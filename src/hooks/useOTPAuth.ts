
import { useOTPState } from './otp/useOTPState';
import { useOTPHandlers } from './otp/useOTPHandlers';

export const useOTPAuth = () => {
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
    setIsSaving
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
    editPhoneNumber
  };
};
