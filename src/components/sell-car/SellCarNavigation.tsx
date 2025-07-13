
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SellCarNavigationProps {
  currentStep: number;
  activeCarListings: number;
  carLimit: number;
  termsAccepted: boolean;
  isEditMode?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: () => boolean;
}

const SellCarNavigation = ({ 
  currentStep, 
  activeCarListings, 
  carLimit, 
  termsAccepted,
  isEditMode = false,
  onPrevious, 
  onNext, 
  onSubmit,
  canSubmit
}: SellCarNavigationProps) => {
  const canProceed = () => {
    if (currentStep === 4) {
      return termsAccepted;
    }
    return true;
  };

  const getSubmitButtonText = () => {
    if (isEditMode) {
      return "Update Listing";
    }
    return "Post for Free";
  };

  return (
    <div className="mt-8 pb-24 lg:pb-8">
      <div className="flex justify-between gap-4">
        {/* Previous Button */}
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}

        {/* Next/Submit Button */}
        <div className="flex-1 flex justify-end">
          {currentStep === 4 ? (
            <Button
              onClick={onSubmit}
              disabled={!canSubmit()}
              className="flex items-center gap-2 px-8"
              size="lg"
            >
              {getSubmitButtonText()}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellCarNavigation;
