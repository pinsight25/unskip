
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useSellCarForm } from '@/hooks/useSellCarForm';
import CarDetailsStep from '@/components/sell-car/CarDetailsStep';
import PricingStep from '@/components/sell-car/PricingStep';
import PhotosStep from '@/components/sell-car/PhotosStep';
import LocationContactStep from '@/components/sell-car/LocationContactStep';
import ReviewStep from '@/components/sell-car/ReviewStep';

const SellCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, setFormData, validatePrice, validateMileage } = useSellCarForm();

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
      setFormData({ ...formData, phoneVerified: true });
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
            validateMileage={validateMileage}
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
        return <PhotosStep />;
      case 4:
        return (
          <LocationContactStep 
            formData={formData}
            setFormData={setFormData}
            handlePhoneVerification={handlePhoneVerification}
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
      <div className="pt-16 md:pt-20 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 xl:px-8 pb-44 md:pb-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">Sell Your Car</h1>
              <Badge variant="outline">Step {currentStep} of 5</Badge>
            </div>
            <Progress value={(currentStep / 5) * 100} className="h-2" />
          </div>

          {/* Form Content */}
          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 mb-12">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2"
            >
              Previous
            </Button>
            
            {currentStep === 5 ? (
              <Button 
                onClick={handleSubmit} 
                className="bg-primary px-6 py-2"
                disabled={!formData.termsAccepted}
              >
                Post for Free
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-primary px-6 py-2">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SellCar;
