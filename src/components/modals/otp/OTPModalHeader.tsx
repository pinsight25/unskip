
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface OTPModalHeaderProps {
  purpose: string;
}

const OTPModalHeader = ({ purpose }: OTPModalHeaderProps) => {
  return (
    <DialogHeader className="text-center pb-2">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <DialogTitle className="text-xl font-bold text-gray-900">Verify Phone</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Secure verification to {purpose}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  );
};

export default OTPModalHeader;
