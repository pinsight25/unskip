
import { Card, CardContent } from '@/components/ui/card';
import CarDetailsStep from '@/components/sell-car/CarDetailsStep';
import PricingStep from '@/components/sell-car/PricingStep';
import PhotosStep from '@/components/sell-car/PhotosStep';
import LocationContactStep from '@/components/sell-car/LocationContactStep';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface SellCarStepRendererProps {
  currentStep: number;
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
  validateKilometersDriven: (km: string) => { valid: boolean; message: string };
}

const SellCarStepRenderer = ({ 
  currentStep, 
  formData, 
  setFormData, 
  validatePrice, 
  validateKilometersDriven 
}: SellCarStepRendererProps) => {
  const isMobile = useIsMobile();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CarDetailsStep 
            formData={formData}
            setFormData={setFormData}
            validateKilometersDriven={validateKilometersDriven}
          />
        );
      case 2:
        return (
          <PricingStep 
            formData={formData}
            setFormData={setFormData}
            validatePrice={validatePrice}
          />
        );
      case 3:
        if (isMobile) {
          return (
            <div className="bg-white rounded-lg p-6 pb-40">
              <PhotosStep />
            </div>
          );
        } else {
          return (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <PhotosStep />
              </CardContent>
            </Card>
          );
        }
      case 4:
        return (
          <LocationContactStep 
            formData={formData}
            onUpdate={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Form Content */}
      {currentStep === 3 ? renderStep() : (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SellCarStepRenderer;
