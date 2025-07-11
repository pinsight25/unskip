
import { Button } from '@/components/ui/button';
import { IndianRupee } from 'lucide-react';

interface OfferModalActionsProps {
  isFormValid: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const OfferModalActions = ({
  isFormValid,
  isSubmitting,
  onCancel,
  onSubmit
}: OfferModalActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 h-12 rounded-xl border-2" 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <IndianRupee className="h-4 w-4 mr-2" />
              Send Offer
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By submitting an offer, you agree to our terms and conditions. 
        Your contact information will be shared with the seller if they accept your offer.
      </p>
    </div>
  );
};

export default OfferModalActions;
