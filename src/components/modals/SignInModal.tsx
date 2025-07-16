
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { formatPhoneForAuth, formatPhoneForDB } from '@/utils/phoneUtils';
import ProfileCompletionStep from './signin/ProfileCompletionStep';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({ name: '', email: '', city: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();

  // Reset everything when modal closes
  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
    setUserId('');
    setProfileData({ name: '', email: '', city: '' });
    onClose();
  };

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-add +91 if not present
    let formattedPhone = phone.trim();
    // Remove any spaces or special characters
    formattedPhone = formattedPhone.replace(/\s+/g, '').replace(/-/g, '');
    // Add +91 if it doesn't start with +
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }
    setFormattedPhoneNumber(formattedPhone);
    console.log('🔵 SENDING OTP to:', formattedPhone);
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: true }
      });
      if (error) throw error;
      console.log('✅ OTP sent successfully');
      setStep('otp');
    } catch (err: any) {
      console.error('❌ Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 VERIFYING OTP:', otp);
    setLoading(true);
    setError('');
    try {
      // Use the same formatted phone number as when sending OTP
      let formattedPhone = phone.trim();
      formattedPhone = formattedPhone.replace(/\s+/g, '').replace(/-/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }
      const phoneToVerify = formattedPhoneNumber || formattedPhone;
      console.log('📱 Verifying with phone:', phoneToVerify);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneToVerify,
        token: otp,
        type: 'sms'
      });
      if (error) throw error;
      if (!data.user) throw new Error('No user returned');
      console.log('✅ OTP verified, user:', data.user.id);
      setUserId(data.user.id);
      // Check if user needs profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (!userData?.name || userData.name === 'User' || !userData?.email) {
        console.log('📝 New user - showing profile form');
        setStep('profile');
      } else {
        console.log('✅ Existing user - completing sign in');
        handleSuccess();
      }
    } catch (err: any) {
      console.error('❌ Error verifying OTP:', err);
      if (err.message?.includes('expired')) {
        setError('OTP has expired. Please request a new one.');
      } else if (err.message?.includes('invalid')) {
        setError('Invalid OTP. Please check and try again.');
      } else {
        setError(err.message || 'Failed to verify OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save Profile
  const handleCompleteProfile = async () => {
    setIsSaving(true);
    setError('');
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: profileData.name, email: profileData.email, city: profileData.city })
        .eq('id', userId);
      if (error) throw error;
      handleSuccess();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccess = () => {
    console.log('🎉 Sign in complete!');
    handleClose();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>
            {step === 'phone' && 'Sign In'}
            {step === 'otp' && 'Verify Phone'}
            {step === 'profile' && 'Complete Your Profile'}
          </DialogTitle>
        </DialogHeader>
        {/* Phone Step */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Enter your mobile number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    // Only allow digits and limit to 10
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(value);
                  }}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3 py-3 border rounded-lg focus:border-orange-500 focus:outline-none"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">
                We'll send you a verification code via SMS
              </p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full py-3 bg-orange-500 text-white rounded-lg disabled:opacity-50 hover:bg-orange-600 transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}
        {/* OTP Step - Lovable design, logic unchanged */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
            {/* Phone number display with OTP sent indicator */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <span className="text-gray-700">{phone}</span>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                OTP Sent
              </span>
            </div>

            {/* OTP Input - Simple version */}
            <div className="text-center">
              <p className="text-gray-600 mb-3">Enter 6-digit OTP</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                className="w-40 mx-auto block text-center text-2xl tracking-widest font-mono border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none"
                maxLength={6}
                inputMode="numeric"
                required
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Edit Phone
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 py-3 bg-orange-500 text-white rounded-lg disabled:bg-gray-300"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            {/* Resend link */}
            <p className="text-center text-sm text-gray-500">
              Didn't receive OTP?{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setOtp('');
                  setStep('phone');
                }}
                className="text-orange-500 hover:underline"
              >
                Resend
              </button>
            </p>
          </form>
        )}
        {/* Profile Step */}
        {step === 'profile' && (
          <ProfileCompletionStep
            profileData={profileData}
            setProfileData={setProfileData}
            onCompleteProfile={handleCompleteProfile}
            onCancel={() => {
              setStep('phone');
              setPhone('');
              setOtp('');
            }}
            error={error}
            isSaving={isSaving}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SignInModal;
