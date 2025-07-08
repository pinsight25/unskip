
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useAccessoryForm } from '@/hooks/useAccessoryForm';
import BasicInformationStep from '@/components/accessory/post/BasicInformationStep';
import DetailsCompatibilityStep from '@/components/accessory/post/DetailsCompatibilityStep';
import PhotosContactStep from '@/components/accessory/post/PhotosContactStep';

const PostAccessory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, updateFormData, validateStep } = useAccessoryForm();
  
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
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
      updateFormData('phoneVerified', true);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
    }, 2000);
  };

  const handleSubmit = () => {
    toast({
      title: "Accessory Posted Successfully!",
      description: "Your accessory listing is now live and buyers can contact you.",
    });
    navigate('/accessories');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            formData={formData}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <DetailsCompatibilityStep
            formData={formData}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <PhotosContactStep
            formData={formData}
            onUpdate={updateFormData}
            onPhoneVerification={handlePhoneVerification}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/accessories')}
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

          {/* Form Content */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {renderCurrentStep()}
            </CardContent>
          </Card>

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
            {currentStep === totalSteps ? (
              <Button 
                onClick={handleSubmit} 
                className="w-full sm:w-auto bg-primary px-6 py-2"
                disabled={!validateStep(currentStep)}
              >
                Post Accessory
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                className="w-full sm:w-auto bg-primary px-6 py-2"
                disabled={!validateStep(currentStep)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default PostAccessory;
