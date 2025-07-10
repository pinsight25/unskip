
import { Button } from '@/components/ui/button';

interface SellCarNavigationProps {
  currentStep: number;
  activeCarListings: number;
  carLimit: number;
  termsAccepted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const SellCarNavigation = ({ 
  currentStep, 
  activeCarListings, 
  carLimit, 
  termsAccepted, 
  onPrevious, 
  onNext, 
  onSubmit 
}: SellCarNavigationProps) => {
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
      {currentStep === 5 ? (
        <Button 
          onClick={onSubmit} 
          className="w-full sm:w-auto bg-primary px-6 py-2"
          disabled={!termsAccepted || activeCarListings >= carLimit}
        >
          {activeCarListings >= carLimit ? "Limit Reached" : "Post for Free"}
        </Button>
      ) : (
        <Button onClick={onNext} className="w-full sm:w-auto bg-primary px-6 py-2">
          Next
        </Button>
      )}
    </div>
  );
};

export default SellCarNavigation;
