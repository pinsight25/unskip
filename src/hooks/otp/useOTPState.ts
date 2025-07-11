
import { useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
}

export const useOTPState = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [existingUser, setExistingUser] = useState<any>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    city: '',
    gender: 'Male'
  });
  const [isSaving, setIsSaving] = useState(false);

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('+91 ');
    setOtp('');
    setIsVerified(false);
    setError('');
    setIsVerifying(false);
    setIsSendingOTP(false);
    setProfileData({ name: '', email: '', city: '', gender: 'Male' });
    setIsSaving(false);
    setExistingUser(null);
  };

  const editPhoneNumber = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  return {
    // State
    step,
    setStep,
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
    // Actions
    resetModal,
    editPhoneNumber
  };
};
