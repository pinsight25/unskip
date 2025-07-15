import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/CustomInput';
import { useUser } from '@/contexts/UserContext';
import { offerService } from '@/services/offerService';
import { formatIndianPrice } from '@/utils/priceFormatter';
import OTPModal from '@/components/modals/OTPModal';
import { useOTPAuth } from '@/hooks/useOTPAuth';
import PhoneVerificationStep from '@/components/modals/otp/PhoneVerificationStep';
import OTPVerificationStep from '@/components/modals/otp/OTPVerificationStep';
import VerificationSuccessStep from '@/components/modals/otp/VerificationSuccessStep';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    title: string;
    price: number;
    images: { url: string }[];
    seller_id: string;
  };
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ isOpen, onClose, car }) => {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    amount: car.price,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  // Use real OTP logic
  const otpAuth = useOTPAuth({
    onClose: () => setShowOTPModal(false)
  }) as any; // allow setStep usage

  const minAcceptable = Math.floor(car.price * 0.7);
  const showLowOfferWarning = form.amount < minAcceptable;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const submitOffer = async () => {
    setError('');
    if (user?.id === car.seller_id) {
      setError('You cannot make an offer on your own car.');
      return;
    }
    setLoading(true);
    try {
      await offerService.createOffer({
        car_id: car.id,
        buyer_id: user.id,
        buyer_name: form.name,
        buyer_phone: form.phone,
        seller_id: car.seller_id,
        amount: form.amount,
        message: form.message,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to make offer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.');
      return;
    }
    if (!form.amount || form.amount <= 0) {
      setError('Offer amount must be greater than 0.');
      return;
    }
    if (!user?.phone_verified) {
      otpAuth.setPhoneNumber(form.phone);
      otpAuth.setStep('phone');
      setShowOTPModal(true);
      return;
    }
    await submitOffer();
  };

  // On OTP success, submit offer
  const handleOTPSuccess = async () => {
    setShowOTPModal(false);
    await submitOffer();
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      amount: car.price,
      message: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Car Info */}
          <div className="flex items-center space-x-3">
            {car.images?.[0]?.url && (
              <img src={car.images[0].url} alt={car.title} className="w-16 h-12 object-cover rounded" />
            )}
            <div>
              <div className="font-semibold text-gray-900">{car.title}</div>
              <div className="text-sm text-gray-500">Asking: {formatIndianPrice(car.price)}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
              <CustomInput
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="h-12"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <CustomInput
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="h-12"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Offer Amount</label>
              <CustomInput
                name="amount"
                type="number"
                min={1}
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter your offer"
                className="h-12"
                required
              />
              {showLowOfferWarning && (
                <div className="text-xs text-orange-500 mt-1">Warning: Offers below 70% of asking price are unlikely to be accepted.</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message (optional)</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Add a message for the seller"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows={3}
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">Offer sent successfully!</div>}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </form>
        </div>
      </DialogContent>
      {showOTPModal && (
        <Dialog open={showOTPModal} onOpenChange={() => setShowOTPModal(false)}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white rounded-3xl">
            {/* Phone verification step */}
            {otpAuth.step === 'phone' && (
              <PhoneVerificationStep
                phoneNumber={otpAuth.phoneNumber}
                onPhoneChange={otpAuth.setPhoneNumber}
                onSendOTP={otpAuth.handleSendOTP}
                onCancel={() => setShowOTPModal(false)}
                error={otpAuth.error}
                phoneDigits={otpAuth.phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '')}
              />
            )}
            {/* OTP verification step */}
            {otpAuth.step === 'otp' && (
              <OTPVerificationStep
                phoneNumber={otpAuth.phoneNumber}
                otp={otpAuth.otp}
                onOtpChange={otpAuth.setOtp}
                onVerifyOTP={async () => {
                  await otpAuth.handleVerifyOTP();
                  if (otpAuth.isVerified) handleOTPSuccess();
                }}
                onEditPhone={otpAuth.editPhoneNumber}
                error={otpAuth.error}
                isVerifying={otpAuth.isVerifying}
              />
            )}
            {/* Success step (optional) */}
            {otpAuth.isVerified && (
              <VerificationSuccessStep isOpen={showOTPModal} onClose={() => setShowOTPModal(false)} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default MakeOfferModal; 