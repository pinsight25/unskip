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
        
        // NEW: Create or get user record immediately after auth success
        const userRecord = await createOrGetUserRecord(data.user, formattedPhone);
        
        if (userRecord?.isExisting) {
          console.log('👤 Existing user found:', userRecord.userData);
          setExistingUser(userRecord.userData);
          
          // User exists, sign them in directly
          signIn(formattedPhone, {
            name: userRecord.userData.name,
            email: userRecord.userData.email || '',
            city: userRecord.userData.city,
            gender: userRecord.userData.gender
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

  // NEW: Function to create or get user record
  const createOrGetUserRecord = async (authUser: any, phone: string) => {
    try {
      console.log('🔍 Creating/getting user record for:', authUser.id);
      
      // First try to get existing user
      const { data: existingUserData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching user:', fetchError);
        // Don't throw - we'll create a basic record instead
      }

      if (existingUserData) {
        console.log('✅ User record exists:', existingUserData);
        return { isExisting: true, userData: existingUserData };
      }

      // Create basic user record if it doesn't exist
      console.log('📝 Creating basic user record...');
      const basicUserData = {
        id: authUser.id,
        phone: phone,
        name: authUser.user_metadata?.name || 'User', // Use metadata if available
        email: authUser.email || null,
        city: null,
        gender: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert(basicUserData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating user record:', insertError);
        // Return basic info even if DB insert fails
        return { 
          isExisting: false, 
          userData: { 
            name: 'User', 
            phone: phone, 
            email: authUser.email || '' 
          } 
        };
      }

      console.log('✅ Created basic user record:', newUserData);
      return { isExisting: false, userData: newUserData };

    } catch (err) {
      console.error('❌ Error in createOrGetUserRecord:', err);
      // Return basic fallback
      return { 
        isExisting: false, 
        userData: { 
          name: 'User', 
          phone: phone, 
          email: authUser.email || '' 
        } 
      };
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
