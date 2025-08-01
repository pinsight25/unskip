
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAccessoryForm } from '@/hooks/useAccessoryForm';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';

export const usePostAccessoryForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, updateField, handleSubmit, isLoading } = useAccessoryForm();
  
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
      updateField('phone', formData.phone);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
    }, 2000);
  };

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      toast({
        title: "Accessory Posted Successfully!",
        description: "Your accessory listing is now live and buyers can contact you.",
      });
      navigate('/accessories');
    }
  };

  // Create a wrapper function that matches the expected signature
  const handleUpdate = (field: keyof typeof formData, value: any) => {
    updateField(field, value);
  };

  return {
    currentStep,
    totalSteps,
    formData,
    updateFormData: handleUpdate,
    handleNext,
    handlePrevious,
    handleBack,
    handlePhoneVerification,
    handleSubmit: handleFormSubmit,
    isLoading,
  };
};
