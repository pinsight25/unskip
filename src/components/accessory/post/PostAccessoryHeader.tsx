
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface PostAccessoryHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

const PostAccessoryHeader = ({ currentStep, totalSteps, onBack }: PostAccessoryHeaderProps) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Post Your Accessory</h1>
          <p className="text-gray-600">Sell your car accessories to thousands of buyers</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          <Badge variant="outline">{Math.round((currentStep / totalSteps) * 100)}% Complete</Badge>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>
    </>
  );
};

export default PostAccessoryHeader;
