
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trash2, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { shouldShowUpgradePrompt, getUpgradeMessage } from '@/constants/limits';

interface SellCarHeaderProps {
  currentStep: number;
  activeCarListings: number;
  carLimit: number;
  onBackClick: () => void;
  onClearForm: () => void;
  userType?: 'regular' | 'dealer';
}

const SellCarHeader = ({ currentStep, activeCarListings, carLimit, onBackClick, onClearForm, userType = 'regular' }: SellCarHeaderProps) => {
  const showUpgradePrompt = shouldShowUpgradePrompt(activeCarListings, userType);
  const upgradeMessage = getUpgradeMessage(activeCarListings, userType);

  return (
    <>
      {/* Back Button and Clear Form */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearForm}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Clear Form
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold">Sell Your Car</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {currentStep} of 4</Badge>
            <Badge 
              variant={
                activeCarListings >= carLimit 
                  ? "destructive" 
                  : activeCarListings >= carLimit - 1 
                    ? "secondary" 
                    : "default"
              } 
              className="text-xs"
            >
              {activeCarListings}/{carLimit} cars
              {activeCarListings >= carLimit - 1 && activeCarListings < carLimit && (
                <span className="ml-1 text-orange-600">• Near limit</span>
              )}
            </Badge>
          </div>
        </div>
        <Progress value={(currentStep / 4) * 100} className="h-2" />
        
        {/* Limit warning message */}
        {showUpgradePrompt && upgradeMessage && (
          <div className="mt-3 p-3 rounded-lg border text-sm">
            <div className={`${
              upgradeMessage.type === 'error' 
                ? 'text-red-700 bg-red-50 border-red-200' 
                : 'text-orange-700 bg-orange-50 border-orange-200'
            }`}>
              <strong>{upgradeMessage.message}</strong>
              <div className="mt-2">
                <span>{upgradeMessage.suggestion}</span>
                <Link to="/dealer/register" className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  <Building2 className="h-4 w-4 mr-1" />
                  {upgradeMessage.type === 'error' ? 'Upgrade to Dealer' : 'Upgrade Now'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellCarHeader;
