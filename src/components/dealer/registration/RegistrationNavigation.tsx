
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

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
  canProceed
}: RegistrationNavigationProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-4">
      <Button
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
        className="w-full sm:w-auto flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      {currentStep < totalSteps ? (
        <Button onClick={onNextStep} className="w-full sm:w-auto flex items-center">
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={onSubmit} 
          className="w-full sm:w-auto flex items-center bg-green-600 hover:bg-green-700"
          disabled={!canProceed}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Submit Application
        </Button>
      )}
    </div>
  );
};

export default RegistrationNavigation;
