
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, CheckCircle, Edit, Loader, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

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

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    city: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const { signIn } = useUser();
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
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

    setIsSaving(true);
    setError('');

    setTimeout(() => {
      // Sign in with actual profile data
      signIn(phoneNumber, {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        city: profileData.city
      });
      
      toast({
        title: "Welcome!",
        description: "Your profile has been created successfully.",
      });
      
      onClose();
      resetModal();
      setIsSaving(false);
    }, 1000);
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('+91 98765 43210');
    setOtp('');
    setIsVerified(false);
    setError('');
    setIsVerifying(false);
    setProfileData({ name: '', email: '', city: '' });
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
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Phone Verified!</h3>
            <p className="text-gray-600">Setting up your profile...</p>
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
                  disabled={phoneNumber.length < 10}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
                >
                  Send OTP
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

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-sm text-green-800 font-medium text-center">
                  <strong>🔥 Demo Mode:</strong> Use OTP <code className="bg-green-200 px-3 py-1 rounded-lg text-lg font-bold mx-2">123456</code>
                </p>
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
                  disabled={otp.length !== 6 || isVerifying}
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
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-primary">
                  Didn't receive OTP? Resend in 30s
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
                  disabled={isSaving || !profileData.name.trim() || !profileData.city}
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
