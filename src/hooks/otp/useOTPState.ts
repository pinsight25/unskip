
import { useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
}

type UserType = 'regular' | 'dealer' | null;

export const useOTPState = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'userType' | 'profile'>('phone');
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

  const [userType, setUserType] = useState<UserType>(null);

  const resetModal = () => {
    
    // Reset all step-related states
    setStep('phone');
    setPhoneNumber('+91 ');
    setOtp('');
    
    // Reset all loading and verification states
    setIsVerified(false);
    setIsVerifying(false);
    setIsSendingOTP(false);
    setIsSaving(false);
    
    // Clear error messages
    setError('');
    
    // Reset profile data
    setProfileData({ 
      name: '', 
      email: '', 
      city: '', 
      gender: 'Male' 
    });
    
    // Clear existing user data
    setExistingUser(null);
    setUserType(null);
    
  };

  const editPhoneNumber = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setIsVerified(false);
    setIsVerifying(false);
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
    userType,
    setUserType,
    // Actions
    resetModal,
    editPhoneNumber
  };
};
