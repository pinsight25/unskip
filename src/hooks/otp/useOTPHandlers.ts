
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUserRecord } from './useUserRecord';

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
  setIsSaving
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
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (err) {
      console.error('❌ Unexpected OTP send error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    // Add timeout to prevent getting stuck
    const timeoutId = setTimeout(() => {
      if (setIsVerifying) {
        console.warn('⚠️ OTP verification timeout');
        setError('Verification is taking too long. Please try again or refresh the page.');
        setIsVerifying(false);
      }
    }, 30000); // 30 second timeout
    
    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
      
      console.log('🔵 VERIFYING OTP:');
      console.log('- Phone:', formattedPhone);
      console.log('- OTP:', otp);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      console.log('🔍 OTP Verification Response:', { data, error });

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ OTP verification error:', error);
        setError(error.message || 'Invalid OTP. Please try again.');
        setIsVerifying(false);
        return;
      } 
      
      if (data.user) {
        console.log('✅ OTP verified successfully:', data.user);
        
        // Create or get user record immediately after auth success
        const userRecord = await createOrGetUserRecord(data.user, formattedPhone);
        
        if (userRecord?.isExisting) {
          console.log('👤 Existing user found:', userRecord.userData);
          setExistingUser(userRecord.userData);
          
          // User exists, sign them in directly - safely access optional properties
          const userData = userRecord.userData;
          signIn(formattedPhone, {
            name: userData.name,
            email: userData.email || '',
            city: 'city' in userData ? userData.city : '',
            gender: 'gender' in userData ? userData.gender : undefined
          });
          
          setIsVerified(true);
          setIsVerifying(false);
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
      } else {
        console.error('❌ No user data in verification response');
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('❌ Unexpected verification error:', err);
      setError('An unexpected error occurred. Please try again or refresh the page.');
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
      
      signIn(user.phone!, {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        city: profileData.city,
        gender: profileData.gender
      });
      
      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });
      
      navigate('/profile');
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
