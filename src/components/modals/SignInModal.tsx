
import { useState } from 'react';
import OTPModal from './OTPModal';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [phoneNumber] = useState('+91 98765 43210');
  const { signIn } = useUser();
  const { toast } = useToast();

  const handleOTPSuccess = () => {
    signIn(phoneNumber);
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    onClose();
  };

  return (
    <OTPModal
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handleOTPSuccess}
      phoneNumber={phoneNumber}
      purpose="sign in to your account"
    />
  );
};

export default SignInModal;
