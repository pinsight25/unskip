
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUserRecord } from './useUserRecord';
import type { TablesUpdate } from '@/integrations/supabase/types';

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

  const handleSendOTP = async () => {
    const phoneDigits = phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSendingOTP(true);
    setError('');

    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
      
      console.log('🔵 SENDING OTP:');
      console.log('- Phone:', formattedPhone);
      console.log('- Current localStorage auth:', localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token'));
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('❌ OTP send error:', error);
        setError(error.message || 'Failed to send OTP. Please try again.');
      } else {
        console.log('✅ OTP sent successfully');
        setStep('otp');
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${formattedPhone}`,
        });
      }
    } catch (err) {
      console.error('❌ Unexpected OTP send error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTPWithRetry = async (attempt = 1, maxAttempts = 3): Promise<any> => {
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
    
    console.log(`🔵 OTP VERIFICATION ATTEMPT ${attempt}/${maxAttempts}:`);
    console.log('- Phone:', formattedPhone);
    console.log('- OTP:', otp);
    console.log('- Timestamp:', new Date().toISOString());
    
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
      console.log(`✅ OTP verification completed on attempt ${attempt}:`, result);
      return result;
    } catch (error: any) {
      console.error(`❌ OTP verification error on attempt ${attempt}:`, {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.details,
        hint: error.hint
      });

      // If it's a timeout and we have retries left, try again
      if (error.message?.includes('timeout') && attempt < maxAttempts) {
        console.log(`🔄 Retrying OTP verification (attempt ${attempt + 1}/${maxAttempts})...`);
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
      console.log('🔵 STARTING OTP VERIFICATION PROCESS');
      
      const { data, error } = await verifyOTPWithRetry();

      if (error) {
        console.error('❌ Final OTP verification error:', error);
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
        console.log('✅ OTP verified successfully:', data.user.id);
        
        // Create or get user record immediately after auth success
        try {
          console.log('🔄 Creating/getting user record...');
          const userRecord = await createOrGetUserRecord(data.user, phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, ''));
          
          // NEW: Update phone_verified status to true
          const { error: updateError } = await supabase
            .from('users')
            .update({ phone_verified: true } as any)
            .eq('id', data.user.id);
          if (updateError) {
            console.error('Error updating phone verification status:', updateError);
            // Don't throw - user is still authenticated
          }
          
          if (userRecord?.isExisting) {
            console.log('👤 Existing user found:', userRecord.userData);
            setExistingUser(userRecord.userData);
            
            // Sign in the user
            const userData = userRecord.userData;
            await signIn(phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, ''));
            
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
            console.log('👤 New user - showing profile form');
            setIsVerified(true);
            setTimeout(() => {
              setStep('profile');
              setIsVerifying(false);
              setIsVerified(false);
            }, 1500);
            return { isExistingUser: false };
          }
        } catch (userRecordError) {
          console.error('❌ Error creating/getting user record:', userRecordError);
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
        console.error('❌ No user data in verification response');
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ Unexpected verification error:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
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
      console.log('🔍 Starting profile completion process...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth user:', user);
      console.log('Auth error:', authError);
      
      if (authError) {
        console.error('❌ Auth error:', authError);
        setError('Authentication error. Please try signing in again.');
        return;
      }
      
      if (!user) {
        console.error('❌ No authenticated user found');
        setError('No authenticated user found. Please try signing in again.');
        return;
      }

      // Update the existing basic user record with profile data
      const updatedUserData = {
        name: profileData.name.trim(),
        email: profileData.email.trim() || null,
        city: profileData.city,
        gender: profileData.gender,
        updated_at: new Date().toISOString()
      };
      
      console.log('📝 Updating user profile with:', updatedUserData);
      
      const { data, error: profileError } = await supabase
        .from('users')
        .update(updatedUserData)
        .eq('id', user.id)
        .select()
        .single();

      console.log('📊 Update response data:', data);
      
      if (profileError) {
        console.error('❌ Profile update error:', profileError);
        setError(`Failed to update profile: ${profileError.message}`);
        return;
      }

      console.log('✅ Profile updated successfully:', data);
      
      await signIn(user.phone!);
      
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
      console.error('❌ Unexpected profile completion error:', err);
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
