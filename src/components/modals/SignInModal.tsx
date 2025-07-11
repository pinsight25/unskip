import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Phone, CheckCircle, Edit, Loader, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Link, useNavigate } from 'react-router-dom';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cities = [
  'Chennai',
  'Mumbai', 
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Kolkata'
];

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

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
  
  // Profile form state
  const [profileData, setProfileData] = useState({
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
      // Format phone number to ensure +91 prefix
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
      // Format phone number to ensure +91 prefix
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
        
        // Check if user exists in users table
        const { data: existingUserData, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('phone', formattedPhone)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user:', fetchError);
        }

        if (existingUserData) {
          // Existing user - sign them in directly
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
          // New user - show profile completion
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
        // Format phone number for storage
        const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
        
        // Create user profile in users table
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

        // Sign in with profile data in context
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
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              {existingUser ? 'Welcome Back!' : 'Phone Verified!'}
            </h3>
            <p className="text-gray-600">
              {existingUser ? 'Signing you in...' : 'Setting up your profile...'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
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
          {step === 'phone' ? (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={15}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:border-primary focus:outline-none transition-colors text-lg"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 h-12 rounded-2xl border-2">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendOTP} 
                  disabled={phoneNumber.length < 10 || isSendingOTP}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
                >
                  {isSendingOTP ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </div>
            </>
          ) : step === 'otp' ? (
            <>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium flex-1 text-gray-700">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={editPhoneNumber} className="h-8 w-8 p-0 rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  OTP Sent
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <label className="text-sm font-semibold text-gray-700 block mb-3">Enter 6-digit OTP</label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    className="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg font-bold border-2 rounded-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Terms Acceptance Checkbox */}
                <div className="flex items-start space-x-3 py-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={handleTermsChange}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-orange-600 hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-orange-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={editPhoneNumber} className="flex-1 h-12 rounded-2xl border-2">
                  Edit Phone
                </Button>
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otp.length !== 6 || isVerifying || !termsAccepted}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
                >
                  {isVerifying ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>

              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={handleSendOTP} disabled={isSendingOTP} className="text-xs text-gray-500 hover:text-primary">
                  {isSendingOTP ? 'Sending...' : 'Didn\'t receive OTP? Resend'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Full Name *</label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Gender *</label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      {genders.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value} className="hover:bg-gray-50">
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Email (Optional)</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">City *</label>
                  <Select value={profileData.city} onValueChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      {cities.map((city) => (
                        <SelectItem key={city} value={city} className="hover:bg-gray-50">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 h-12 rounded-2xl border-2" disabled={isSaving}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCompleteProfile} 
                  disabled={isSaving || !profileData.name.trim() || !profileData.city || !profileData.gender}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
