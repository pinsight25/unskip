
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Loader } from 'lucide-react';

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
  return (
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
        <Button variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-2xl border-2">
          Cancel
        </Button>
        <Button 
          onClick={onSendOTP} 
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
  );
};

export default PhoneInputStep;
