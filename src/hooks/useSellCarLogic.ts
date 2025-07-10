
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSellCarForm } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';
import { FREE_LIMITS, getCarLimit } from '@/constants/limits';

export const useSellCarLogic = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, setFormData, validatePrice, validateKilometersDriven } = useSellCarForm();

  // Mock active car listings count - will be replaced with real data from Supabase
  const activeCarListings = 3; // Mock count
  const userType = 'regular'; // Mock user type - will come from user context
  const carLimit = getCarLimit(userType);

  // Handle duplicate listing data on component mount
  useEffect(() => {
    const isDuplicate = searchParams.get('duplicate') === 'true';
    if (isDuplicate) {
      const duplicateDataString = sessionStorage.getItem('duplicateListingData');
      if (duplicateDataString) {
        try {
          const duplicateData = JSON.parse(duplicateDataString);
          // Clear photos and specific identifiers for the duplicate
          const cleanedData = {
            ...duplicateData,
            photos: [], // Clear photos
            coverPhotoIndex: 0,
            phone: '', // Clear phone for privacy
            phoneVerified: false,
            termsAccepted: false, // Require re-acceptance
          };
          
          setFormData(prevData => ({
            ...prevData,
            ...cleanedData
          }));
          
          // Clear the stored data
          sessionStorage.removeItem('duplicateListingData');
          
          toast({
            title: "Listing Duplicated",
            description: "Your listing has been copied. Update the details and photos as needed.",
          });
        } catch (error) {
          console.error('Error parsing duplicate data:', error);
          toast({
            title: "Error",
            description: "Failed to duplicate listing. Please try again.",
            variant: "destructive"
          });
        }
      }
    }
  }, [searchParams, setFormData, toast]);

  const handleNext = () => {
    if (currentStep < 4) {
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
    // Check car listing limit before submission
    if (activeCarListings >= carLimit) {
      toast({
        title: "Listing Limit Reached",
        description: `You've reached your free limit of ${carLimit} car listings. Remove an old listing to post a new one.`,
        variant: "destructive"
      });
      return;
    }

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

  const handleBackToHome = () => {
    navigate('/');
  };

  return {
    currentStep,
    formData,
    setFormData,
    activeCarListings,
    carLimit,
    validatePrice,
    validateKilometersDriven,
    handleNext,
    handlePrevious,
    handlePhoneVerification,
    handleSubmit,
    handleBackToHome
  };
};
