import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useSellCarForm } from '@/hooks/useSellCarForm';
import CarDetailsStep from '@/components/sell-car/CarDetailsStep';
import PricingStep from '@/components/sell-car/PricingStep';
import PhotosStep from '@/components/sell-car/PhotosStep';
import LocationContactStep from '@/components/sell-car/LocationContactStep';
import ReviewStep from '@/components/sell-car/ReviewStep';
import { useIsMobile } from '@/hooks/use-mobile';
import { updateFormField } from '@/utils/formHelpers';

const SellCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, setFormData, validatePrice, validateKilometersDriven } = useSellCarForm();
  const isMobile = useIsMobile();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Car Listed Successfully!",
      description: "Your car has been posted. You'll receive calls from interested buyers soon.",
    });
    navigate('/');
  };

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
          />
        );
      case 5:
        return (
          <ReviewStep 
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveLayout>
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-32 responsive-header-spacing">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
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
            <Badge variant="outline">Step {currentStep} of 5</Badge>
          </div>
          <Progress value={(currentStep / 5) * 100} className="h-2" />
        </div>

        {/* Form Content */}
        {currentStep === 3 ? renderStep() : (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6 mb-12">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="w-full sm:w-auto px-6 py-2"
          >
            Previous
          </Button>
          {currentStep === 5 ? (
            <Button 
              onClick={handleSubmit} 
              className="w-full sm:w-auto bg-primary px-6 py-2"
              disabled={!formData.termsAccepted}
            >
              Post for Free
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full sm:w-auto bg-primary px-6 py-2">
              Next
            </Button>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SellCar;
