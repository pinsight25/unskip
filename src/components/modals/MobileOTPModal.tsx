import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PhoneInput } from '@/components/ui/phone-input';
import { Shield, Phone, CheckCircle, Edit, User, Loader } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/contexts/SupabaseContext';

interface MobileOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  phoneNumber: string;
  purpose: string;
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

const MobileOTPModal = ({ isOpen, onClose, onSuccess, phoneNumber: initialPhone, purpose }: MobileOTPModalProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '+91 ');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
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
  const navigate = useNavigate();
  const { supabase } = useSupabase();

  const phoneDigits = phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '');

  const handleSendOTP = () => {
    if (phoneDigits.length >= 10) {
      setStep('otp');
      setError('');
    } else {
      setError('Please enter a valid phone number');
    }
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    setError('');
    
    setTimeout(() => {
      if (otp === '123456') {
        setIsVerified(true);
        setTimeout(() => {
          setStep('profile');
          setIsVerifying(false);
          setIsVerified(false);
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
        setIsVerifying(false);
      }
    }, 1000);
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

    console.log('🔍 [Mobile] Starting profile completion process...');
    
    try {
      // Get the authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('[Mobile] Auth user:', user);
      console.log('[Mobile] Auth error:', authError);
      
      if (authError) {
        console.error('❌ [Mobile] Auth error:', authError);
        setError('Authentication error. Please try signing in again.');
        return;
      }
      
      if (!user) {
        console.error('❌ [Mobile] No authenticated user found');
        setError('No authenticated user found. Please try signing in again.');
        return;
      }

      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber.replace(/\D/g, '');
      
      const userData = {
        id: user.id,
        phone: formattedPhone,
        name: profileData.name.trim(),
        email: profileData.email.trim() || null,
        city: profileData.city,
        gender: profileData.gender,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📝 [Mobile] Attempting to insert user data:', userData);
      
      const { data, error: profileError } = await supabase
        .from('users')
        .insert([userData]);

      console.log('📊 [Mobile] Insert response data:', data);

      if (profileError) {
        console.error('❌ [Mobile] Supabase error code:', profileError.code);
        console.error('❌ [Mobile] Supabase error message:', profileError.message);
        console.error('❌ [Mobile] Supabase error details:', profileError.details);
        console.error('❌ [Mobile] Full error object:', profileError);
        setError(`Failed to create profile: ${profileError.message}`);
        return;
      }

      console.log('✅ [Mobile] Profile created successfully');
      
      // Sign in with actual profile data including gender
      signIn(phoneNumber, {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        city: profileData.city,
        gender: profileData.gender
      });
      
      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });
      
      onSuccess();
      onClose();
      resetModal();
      setIsSaving(false);
      
      // Route to profile page after completion
      navigate('/profile');
    } catch (err) {
      console.error('❌ [Mobile] Unexpected profile completion error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber(initialPhone || '+91 ');
    setOtp('');
    setIsVerified(false);
    setError('');
    setIsVerifying(false);
    setProfileData({ name: '', email: '', city: '', gender: '' });
    setIsSaving(false);
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

  if (isVerified) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Verification Successful!</h3>
            <p className="text-muted-foreground text-lg">Setting up your profile...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              {step === 'profile' ? <User className="h-5 w-5 text-primary" /> : <Shield className="h-5 w-5 text-primary" />}
            </div>
            <DialogTitle className="text-lg">
              {step === 'profile' ? 'Complete Your Profile' : 'Verify Your Phone'}
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {step === 'profile' 
              ? 'Just a few details to get started'
              : `To ensure safe transactions, we need to verify your phone number before you can ${purpose}.`
            }
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-4">
                <label className="text-base font-medium">Enter your phone number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-20" />
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="pl-12 h-14 text-base"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>
              <Button 
                onClick={handleSendOTP} 
                disabled={phoneDigits.length < 10}
                className="w-full h-12 text-base font-semibold"
              >
                Send OTP
              </Button>
            </>
          ) : step === 'otp' ? (
            <>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-base font-medium flex-1">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={editPhoneNumber}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-white">
                  OTP Sent
                </Badge>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium text-center">
                  <strong>🔥 Demo Mode:</strong><br />
                  Use OTP <code className="bg-green-200 px-3 py-1 rounded text-xl font-bold">123456</code> to verify
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-base font-medium">Enter 6-digit OTP</label>
                <Input
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest h-14"
                  inputMode="numeric"
                  maxLength={6}
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="text-center">
                <Button variant="ghost" size="sm" className="text-sm">
                  Didn't receive OTP? Resend
                </Button>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full h-12 text-base font-semibold"
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={editPhoneNumber} 
                  className="w-full h-12 text-base"
                >
                  Edit Phone Number
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
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">Gender *</label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="h-12">
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
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">City *</label>
                  <Select value={profileData.city} onValueChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}>
                    <SelectTrigger className="h-12">
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
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleCompleteProfile} 
                  disabled={isSaving || !profileData.name.trim() || !profileData.city || !profileData.gender}
                  className="w-full h-12 text-base font-semibold"
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
                <Button 
                  variant="outline" 
                  onClick={handleClose} 
                  className="w-full h-12 text-base"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileOTPModal;
