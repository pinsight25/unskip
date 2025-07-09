
import { Button } from '@/components/ui/button';

interface PostAccessoryNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isLimitReached: boolean;
}

const PostAccessoryNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canProceed,
  isLimitReached
}: PostAccessoryNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 mb-12">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="w-full sm:w-auto px-6 py-2"
      >
        Previous
      </Button>
      {currentStep === totalSteps ? (
        <Button 
          onClick={onSubmit} 
          className="w-full sm:w-auto bg-primary px-6 py-2"
          disabled={!canProceed || isLimitReached}
        >
          Post Accessory
        </Button>
      ) : (
        <Button 
          onClick={onNext} 
          className="w-full sm:w-auto bg-primary px-6 py-2"
          disabled={!canProceed}
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default PostAccessoryNavigation;
