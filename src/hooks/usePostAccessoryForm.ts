
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAccessoryForm } from '@/hooks/useAccessoryForm';

export const usePostAccessoryForm = () => {
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

  const handleBack = () => {
    navigate('/accessories');
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

  // Create a wrapper function that matches the expected signature
  const handleUpdate = (updates: Partial<typeof formData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      updateFormData(key as keyof typeof formData, value);
    });
  };

  return {
    currentStep,
    totalSteps,
    formData,
    updateFormData: handleUpdate,
    validateStep,
    handleNext,
    handlePrevious,
    handleBack,
    handlePhoneVerification,
    handleSubmit,
  };
};
