
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

interface SellCarHeaderProps {
  currentStep: number;
  activeCarListings: number;
  carLimit: number;
  onBackClick: () => void;
}

const SellCarHeader = ({ currentStep, activeCarListings, carLimit, onBackClick }: SellCarHeaderProps) => {
  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold">Sell Your Car</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {currentStep} of 4</Badge>
            <Badge variant={activeCarListings >= carLimit - 1 ? "destructive" : "secondary"} className="text-xs">
              {activeCarListings}/{carLimit} cars
            </Badge>
          </div>
        </div>
        <Progress value={(currentStep / 4) * 100} className="h-2" />
      </div>
    </>
  );
};

export default SellCarHeader;
