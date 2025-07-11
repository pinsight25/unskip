
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
    console.log('🔄 Resetting modal state...');
    
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
    
    console.log('✅ Modal state reset complete');
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
    // Actions
    resetModal,
    editPhoneNumber
  };
};
