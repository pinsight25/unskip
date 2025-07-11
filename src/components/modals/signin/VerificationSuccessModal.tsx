
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface VerificationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingUser: any;
}

const VerificationSuccessModal = ({ isOpen, onClose, existingUser }: VerificationSuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
};

export default VerificationSuccessModal;
