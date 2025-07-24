
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/CustomInput';
import { Loader } from 'lucide-react';
import { useState } from 'react';

interface PhoneInputStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  onSendOTP: () => void;
  onCancel: () => void;
  error: string;
  isSendingOTP: boolean;
}

const PhoneInputStep = ({
  phoneNumber,
  setPhoneNumber,
  onSendOTP,
  onCancel,
  error,
  isSendingOTP
}: PhoneInputStepProps) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isValidPhone = (value: string) => value.replace(/\D/g, '').length === 10;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (!isValidPhone(value)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    } else {
      setPhoneError('');
    }
  };

  const displayPhone = phoneNumber.replace(/^\+91\s?/, '').replace(/\D/g, '');

  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="phone-input" className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              +91
            </span>
            <CustomInput
              id="phone-input"
              type="tel"
              value={displayPhone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                setPhoneNumber('+91 ' + digits);
              }}
              placeholder="98765 43210"
              className="pl-12 h-12 text-lg rounded-2xl border-2 focus:border-primary"
              maxLength={10}
              aria-label="Phone Number"
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
        )}
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-2xl border-2">
          Cancel
        </Button>
        <Button 
          onClick={onSendOTP} 
          disabled={displayPhone.length < 10 || isSendingOTP || !isValidPhone(phone)}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
        >
          {isSendingOTP ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Sending OTP to {phoneNumber}...
            </>
          ) : (
            'Send OTP'
          )}
        </Button>
      </div>
    </>
  );
};

export default PhoneInputStep;
