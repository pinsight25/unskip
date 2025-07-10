
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RegistrationNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  canProceed: boolean;
}

const RegistrationNavigation = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  onSubmit,
  canProceed,
}: RegistrationNavigationProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center gap-4">
        {/* Previous Button */}
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevStep}
            className="flex items-center gap-2 min-w-[100px] h-12"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}

        {/* Spacer when no previous button */}
        {currentStep === 1 && <div className="flex-1" />}

        {/* Next/Submit Button */}
        <div className="flex-1 flex justify-end">
          {currentStep === totalSteps ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!canProceed}
              className="flex items-center gap-2 px-8 h-12 min-w-[120px]"
              size="lg"
            >
              Submit Application
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNextStep}
              disabled={!canProceed}
              className="flex items-center gap-2 h-12 min-w-[100px]"
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

export default RegistrationNavigation;
