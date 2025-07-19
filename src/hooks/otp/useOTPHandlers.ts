
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUserRecord } from './useUserRecord';
import type { TablesUpdate } from '@/integrations/supabase/types';
import { useRef, useState, useEffect } from 'react';
import { formatPhoneForAuth, formatPhoneForDB } from '@/utils/phoneUtils';

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
}

interface OTPHandlersProps {
  phoneNumber: string;
  otp: string;
  profileData: ProfileData;
  setError: (error: string) => void;
  setIsSendingOTP: (loading: boolean) => void;
  setStep: (step: 'phone' | 'otp' | 'profile') => void;
  setIsVerifying: (verifying: boolean) => void;
  setExistingUser: (user: any) => void;
  setIsVerified: (verified: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  onClose?: () => void;
  resetModal?: () => void;
}

export const useOTPHandlers = ({
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
  onClose,
  resetModal
}: OTPHandlersProps) => {
  const { signIn } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createOrGetUserRecord } = useUserRecord();

  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);

  // Reset otpRequestId when modal closes
  useEffect(() => {
    if (typeof onClose === 'function') {
      setOtpRequestId(null);
    }
  }, [onClose]);

  const handleSendOTP = async () => {
    const requestId = Date.now().toString();
    if (otpRequestId) {
      return;
    }
    setOtpRequestId(requestId);

    const phoneDigits = phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number');
      setOtpRequestId(null);
      return;
    }

    setIsSendingOTP(true);
    setError('');

    try {
      const formattedPhone = formatPhoneForAuth(phoneNumber);
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: true }
      });
      if (error) {
        setError(error.message || 'Failed to send OTP. Please try again.');
      } else {
        setStep('otp');
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${formattedPhone}`,
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingOTP(false);
      // Do not reset otpRequestId here; only reset on modal close or error
    }
  };

  const verifyOTPWithRetry = async (attempt = 1, maxAttempts = 3): Promise<any> => {
    const formattedPhone = formatPhoneForAuth(phoneNumber);
    
    try {
      // Create a promise that will timeout after 45 seconds
      const verificationPromise = supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Verification timeout after 45 seconds (attempt ${attempt})`));
        }, 45000);
      });

      const result = await Promise.race([verificationPromise, timeoutPromise]);
      return result;
    } catch (error: any) {
      // If it's a timeout and we have retries left, try again
      if (error.message?.includes('timeout') && attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return verifyOTPWithRetry(attempt + 1, maxAttempts);
      }

      throw error;
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      
      const { data, error } = await verifyOTPWithRetry();

      if (error) {
        let errorMessage = 'Invalid OTP. Please try again.';
        
        // Provide more specific error messages
        if (error.message?.includes('timeout')) {
          errorMessage = 'Verification is taking too long. Please try again or refresh the page.';
        } else if (error.message?.includes('expired')) {
          errorMessage = 'OTP has expired. Please request a new one.';
        } else if (error.message?.includes('invalid')) {
          errorMessage = 'Invalid OTP code. Please check and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        setIsVerifying(false);
        return;
      } 
      
      if (data.user) {
        
        // Create or get user record immediately after auth success
        try {
          
          const userRecord = await createOrGetUserRecord(data.user, formatPhoneForDB(phoneNumber));
          
          // Only update is_verified for existing users
          if (userRecord?.isExisting) {
            const { data: updateData, error: updateError } = await supabase
              .from('users')
              .update({ is_verified: true, updated_at: new Date().toISOString() })
              .eq('id', data.user.id)
              .select()
              .single();
            if (updateError) {
              // Don't throw - user is still authenticated
            }
          }
          
          if (userRecord?.isExisting) {
            setExistingUser(userRecord.userData);
            
            // Sign in the user
            const userData = userRecord.userData;
            await signIn(formatPhoneForDB(phoneNumber));
            
            setIsVerified(true);
            setIsVerifying(false);
            
            // Ensure modal closes properly after success message
            setTimeout(() => {
              if (onClose) {
                onClose(); // Close the modal
              }
              if (resetModal) {
                resetModal(); // Reset all modal states
              }
            }, 1500);
            
            return { isExistingUser: true };
          } else {
            setIsVerified(true);
            setTimeout(() => {
              setStep('profile');
              setIsVerifying(false);
              setIsVerified(false);
            }, 1500);
            return { isExistingUser: false };
          }
        } catch (userRecordError) {
          // Continue with auth but show profile form
          setIsVerified(true);
          setTimeout(() => {
            setStep('profile');
            setIsVerifying(false);
            setIsVerified(false);
          }, 1500);
          return { isExistingUser: false };
        }
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.message?.includes('timeout')) {
        errorMessage = 'The verification process is taking too long. Please refresh the page and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profileData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!profileData.city) {
      setError('Please select your city');
      return;
    }
    if (!profileData.gender) {
      setError('Please select your gender');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        setError('Authentication error. Please try signing in again.');
        return;
      }
      
      if (!user) {
        setError('No authenticated user found. Please try signing in again.');
        return;
      }

      // Ensure city is included in the upsert payload
      const userRecord = {
        name: profileData.name,
        email: profileData.email,
        city: profileData.city,
        phone: formatPhoneForDB(phoneNumber),
        gender: null,
        user_type: 'regular' as const,
        is_verified: true
      };
      
      
      const { data, error: profileError } = await supabase
        .from('users')
        .update(userRecord)
        .eq('id', user.id)
        .select()
        .single();

      
      if (profileError) {
        setError(`Failed to update profile: ${profileError.message}`);
        return;
      }

      
      await signIn(formatPhoneForDB(phoneNumber));
      
      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });
      
      navigate('/profile');
      
      // Close modal and reset state
      if (onClose) {
        onClose();
      }
      if (resetModal) {
        resetModal();
      }
      
      return { success: true };
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSendOTP,
    handleVerifyOTP,
    handleCompleteProfile
  };
};
