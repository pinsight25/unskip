
import { Card, CardContent } from '@/components/ui/card';
import CarDetailsStep from '@/components/sell-car/CarDetailsStep';
import PricingStep from '@/components/sell-car/PricingStep';
import PhotosStep from '@/components/sell-car/PhotosStep';
import LocationContactStep from '@/components/sell-car/LocationContactStep';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { updateFormField } from '@/utils/formHelpers';
import { useToast } from '@/hooks/use-toast';

interface SellCarStepRendererProps {
  currentStep: number;
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  updateFormData: (updates: Partial<SellCarFormData>) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
  validateKilometersDriven: (km: string) => { valid: boolean; message: string };
}

const SellCarStepRenderer = ({ 
  currentStep, 
  formData, 
  setFormData, 
  updateFormData,
  validatePrice, 
  validateKilometersDriven 
}: SellCarStepRendererProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handlePhoneVerification = () => {
    toast({
      title: "OTP Sent",
      description: "Please check your phone for verification code",
    });
    // Simulate verification
    setTimeout(() => {
      setFormData(prev => updateFormField(prev, 'phoneVerified', true));
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CarDetailsStep 
            formData={formData}
            setFormData={setFormData}
            updateFormData={updateFormData}
            validateKilometersDriven={validateKilometersDriven}
          />
        );
      case 2:
        return (
          <PricingStep 
            formData={formData}
            setFormData={setFormData}
            updateFormData={updateFormData}
            validatePrice={validatePrice}
          />
        );
      case 3:
        if (isMobile) {
          return (
            <div className="bg-white rounded-lg p-6 pb-40">
              <PhotosStep formData={formData} setFormData={setFormData} updateFormData={updateFormData} />
            </div>
          );
        } else {
          return (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <PhotosStep formData={formData} setFormData={setFormData} updateFormData={updateFormData} />
              </CardContent>
            </Card>
          );
        }
      case 4:
        return (
          <LocationContactStep 
            formData={formData}
            setFormData={setFormData}
            updateFormData={updateFormData}
            onPhoneVerification={handlePhoneVerification}
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
