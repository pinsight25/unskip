
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useNavigate } from 'react-router-dom';

import PhoneInputStep from './signin/PhoneInputStep';
import OTPVerificationStep from './signin/OTPVerificationStep';
import ProfileCompletionStep from './signin/ProfileCompletionStep';
import VerificationSuccessModal from './signin/VerificationSuccessModal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: string;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [existingUser, setExistingUser] = useState<any>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    city: '',
    gender: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const { signIn } = useUser();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsSendingOTP(true);
    setError('');

    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
      
      console.log('Sending OTP to:', formattedPhone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('OTP send error:', error);
        setError(error.message || 'Failed to send OTP. Please try again.');
      } else {
        console.log('OTP sent successfully');
        setStep('otp');
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
      
      console.log('Verifying OTP for:', formattedPhone);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP verification error:', error);
        setError(error.message || 'Invalid OTP. Please try again.');
      } else if (data.user) {
        console.log('OTP verified successfully:', data.user);
        
        const { data: existingUserData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('phone', formattedPhone)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user:', fetchError);
        }

        if (existingUserData) {
          console.log('Existing user found:', existingUserData);
          setExistingUser(existingUserData);
          
          signIn(formattedPhone, {
            name: existingUserData.name,
            email: existingUserData.email || '',
            city: existingUserData.city,
            gender: existingUserData.gender
          });
          
          setIsVerified(true);
          setTimeout(() => {
            toast({
              title: "Welcome back!",
              description: "You've been signed in successfully.",
            });
            onClose();
            resetModal();
            navigate('/profile');
          }, 1500);
        } else {
          console.log('New user - showing profile form');
          setIsVerified(true);
          setTimeout(() => {
            setStep('profile');
            setIsVerifying(false);
            setIsVerified(false);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Unexpected verification error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      if (!isVerified && !existingUser) {
        setIsVerifying(false);
      }
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            phone: formattedPhone,
            name: profileData.name.trim(),
            email: profileData.email.trim() || null,
            city: profileData.city,
            gender: profileData.gender,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          setError('Failed to create profile. Please try again.');
          return;
        }

        signIn(formattedPhone, {
          name: profileData.name.trim(),
          email: profileData.email.trim(),
          city: profileData.city,
          gender: profileData.gender
        });
        
        toast({
          title: "Welcome!",
          description: "Your profile has been created successfully.",
        });
        
        onClose();
        resetModal();
        navigate('/profile');
      }
    } catch (err) {
      console.error('Profile completion error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('+91 98765 43210');
    setOtp('');
    setIsVerified(false);
    setError('');
    setIsVerifying(false);
    setIsSendingOTP(false);
    setProfileData({ name: '', email: '', city: '', gender: '' });
    setIsSaving(false);
    setTermsAccepted(true);
    setExistingUser(null);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const editPhoneNumber = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (error && checked) {
      setError('');
    }
  };

  if (isVerified) {
    return (
      <VerificationSuccessModal 
        isOpen={isOpen}
        onClose={handleClose}
        existingUser={existingUser}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
        <DialogHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              {step === 'profile' ? <User className="h-6 w-6 text-white" /> : <Shield className="h-6 w-6 text-white" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {step === 'profile' ? 'Complete Your Profile' : 'Verify Phone'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {step === 'profile' ? 'Just a few details to get started' : 'Secure verification to sign in to your account'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {step === 'phone' && (
            <PhoneInputStep
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSendOTP={handleSendOTP}
              onCancel={handleClose}
              error={error}
              isSendingOTP={isSendingOTP}
            />
          )}

          {step === 'otp' && (
            <OTPVerificationStep
              phoneNumber={phoneNumber}
              otp={otp}
              setOtp={setOtp}
              onVerifyOTP={handleVerifyOTP}
              onEditPhone={editPhoneNumber}
              onResendOTP={handleSendOTP}
              error={error}
              isVerifying={isVerifying}
              isSendingOTP={isSendingOTP}
              termsAccepted={termsAccepted}
              onTermsChange={handleTermsChange}
            />
          )}

          {step === 'profile' && (
            <ProfileCompletionStep
              profileData={profileData}
              setProfileData={setProfileData}
              onCompleteProfile={handleCompleteProfile}
              onCancel={handleClose}
              error={error}
              isSaving={isSaving}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
