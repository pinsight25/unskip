import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
}

export const useOTPAuth = () => {
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

  const { signIn } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      if (isVerifying) {
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
      console.log('- Before verification localStorage:', localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token'));
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      console.log('🔍 OTP Verification Response:');
      console.log('- Data:', data);
      console.log('- Error:', error);
      console.log('- User:', data?.user);
      console.log('- Session:', data?.session);
      console.log('- Session access_token:', data?.session?.access_token ? '✅ Present' : '❌ Missing');
      console.log('- Session refresh_token:', data?.session?.refresh_token ? '✅ Present' : '❌ Missing');

      // Check if session is being set in localStorage
      console.log('🔍 LocalStorage after OTP verification:');
      console.log('- Auth token:', localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token'));
      console.log('- All localStorage keys:', Object.keys(localStorage));

      // Check current session from Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('🔍 Current session after verification:', sessionData);
      console.log('- Session error:', sessionError);

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ OTP verification error:', error);
        setError(error.message || 'Invalid OTP. Please try again.');
        setIsVerifying(false);
        return;
      } 
      
      if (data.user) {
        console.log('✅ OTP verified successfully:', data.user);
        
        // Check if user profile already exists in our users table
        const { data: existingUserData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('❌ Error fetching user:', fetchError);
        }

        if (existingUserData) {
          console.log('👤 Existing user found:', existingUserData);
          setExistingUser(existingUserData);
          
          // User exists, sign them in directly
          signIn(formattedPhone, {
            name: existingUserData.name,
            email: existingUserData.email || '',
            city: existingUserData.city,
            gender: existingUserData.gender
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

      const userData = {
        id: user.id,
        phone: user.phone!,
        name: profileData.name.trim(),
        email: profileData.email.trim() || null,
        city: profileData.city,
        gender: profileData.gender,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📝 Attempting to insert user data:', userData);
      
      const { data, error: profileError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      console.log('📊 Insert response data:', data);
      
      if (profileError) {
        console.error('❌ Supabase error code:', profileError.code);
        console.error('❌ Supabase error message:', profileError.message);
        console.error('❌ Supabase error details:', profileError.details);
        console.error('❌ Full error object:', profileError);
        setError(`Failed to create profile: ${profileError.message}`);
        return;
      }

      console.log('✅ Profile created successfully:', data);
      
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
