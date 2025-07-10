
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const { formData, setFormData, validatePrice, validateKilometersDriven } = useSellCarForm();

  // Mock active car listings count - will be replaced with real data from Supabase
  const activeCarListings = 3; // Mock count
  const userType = 'regular'; // Mock user type - will come from user context
  const carLimit = getCarLimit(userType);

  // Handle edit and duplicate listing data on component mount
  useEffect(() => {
    const isDuplicate = searchParams.get('duplicate') === 'true';
    const editId = searchParams.get('edit');

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
    } else if (editId) {
      // Handle edit mode
      const editDataString = sessionStorage.getItem('editListingData');
      if (editDataString) {
        try {
          const editData = JSON.parse(editDataString);
          const { listingId, ...restData } = editData;
          
          setIsEditMode(true);
          setEditingListingId(listingId);
          
          // Load the edit data
          setFormData(prevData => ({
            ...prevData,
            ...restData,
            photos: [], // For now, clear photos as we don't have photo URLs in mock data
            coverPhotoIndex: 0,
            phoneVerified: true, // Assume phone is already verified for existing listings
            termsAccepted: false, // Require re-acceptance
          }));
          
          // Clear the stored data
          sessionStorage.removeItem('editListingData');
          
          toast({
            title: "Editing Listing",
            description: "Make your changes and save to update your listing.",
          });
        } catch (error) {
          console.error('Error parsing edit data:', error);
          toast({
            title: "Error",
            description: "Failed to load listing for editing. Please try again.",
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
    // Check car listing limit before submission (only for new listings)
    if (!isEditMode && activeCarListings >= carLimit) {
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
    
    if (isEditMode) {
      toast({
        title: "Listing Updated!",
        description: "Your car listing has been updated successfully.",
      });
    } else {
      toast({
        title: "Car Listed Successfully!",
        description: "Your car has been posted. You'll receive calls from interested buyers soon.",
      });
    }
    
    navigate('/profile');
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
    isEditMode,
    validatePrice,
    validateKilometersDriven,
    handleNext,
    handlePrevious,
    handlePhoneVerification,
    handleSubmit,
    handleBackToHome
  };
};
