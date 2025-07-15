
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSellCarForm } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';
import { FREE_LIMITS, getCarLimit, canPostMoreCars, getUpgradeMessage } from '@/constants/limits';
import { carService } from '@/services/carService';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

export const useSellCarLogic = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const { formData, setFormData, validatePrice, validateKilometersDriven } = useSellCarForm();
  const { user } = useUser();
  const [activeCarListings, setActiveCarListings] = useState(0);

  // Get user type from user context, fallback to 'regular' if not set
  const userType = user?.userType === 'dealer' ? 'dealer' : 'regular';
  const carLimit = getCarLimit(userType);

  // Proper form data update function that saves to sessionStorage immediately
  const updateFormData = (updates: Partial<typeof formData>) => {
    
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Save to sessionStorage
      try {
        sessionStorage.setItem('sellCarFormData', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save:', error);
      }
      
      return newData;
    });
  };

  // Load saved data on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('sellCarFormData');
    const editId = searchParams.get('edit');
    const duplicateId = searchParams.get('duplicate');
    
    if (savedData && !editId && !duplicateId) {
      try {
        const parsed = JSON.parse(savedData);
        // Normalize photos: filter out blob URLs, only keep valid cloudinaryUrl, clean up structure
        if (Array.isArray(parsed.photos)) {
          parsed.photos = parsed.photos
            .filter(p => {
              // Only keep photos with cloudinaryUrl (skip blob URLs)
              if (typeof p === 'string' && p.startsWith('blob:')) return false;
              if (typeof p === 'object' && p.cloudinaryUrl) return true;
              return false;
            })
            .map((p, idx) => ({
              id: p.id || `persisted-${idx}`,
              cloudinaryUrl: p.cloudinaryUrl,
              isCover: p.isCover || idx === 0
            }));
        }
        
        // Ensure phone number is set from user context if not in saved data
        if (!parsed.phone && user?.phone) {
          parsed.phone = user.phone;
        }
        
        setFormData(parsed);
        
        // Set step based on progress
        if (parsed.photos?.length > 0) setCurrentStep(4);
        else if (parsed.price) setCurrentStep(3);
        else if (parsed.city) setCurrentStep(2);
        else if (parsed.make) setCurrentStep(1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load saved form data.",
          variant: "destructive"
        });
      }
    } else if (user?.phone) {
      // Set phone number from user context for new forms
      setFormData(prev => ({ ...prev, phone: user.phone }));
    }
  }, [user, searchParams]);
  // Save form data to sessionStorage on every update
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0 && !isEditMode) {
      sessionStorage.setItem('sellCarFormData', JSON.stringify(formData));
    }
  }, [formData, isEditMode]);

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
          toast({
            title: "Error",
            description: "Failed to load listing for editing. Please try again.",
            variant: "destructive"
          });
        }
      }
    }
  }, [searchParams, setFormData, toast]);

  // Add effect to load car for edit mode
  useEffect(() => {
    const editCarId = searchParams.get('edit');
    if (editCarId) {
      setEditLoading(true);
      setEditError(null);
      (async () => {
        try {
          const { data: carData, error } = await supabase
            .from('cars')
            .select(`*, car_images (id, image_url, is_cover)`)
            .eq('id', editCarId)
            .single();
          if (error) throw error;
          if (!carData) throw new Error('Car not found');
          if (carData.seller_id !== user?.id) {
            throw new Error('You do not have permission to edit this car');
          }
          // Map photos from car_images
          const mappedPhotos = (carData.car_images || []).map(img => ({
            id: img.id,
            cloudinaryUrl: img.image_url,
            preview: img.image_url,
            isCover: img.is_cover
          }));
          setFormData(prevData => ({
            ...prevData,
            ...carData,
            year: carData.year ? String(carData.year) : '',
            registrationYear: carData.registration_year ? String(carData.registration_year) : '',
            kilometersDriven: carData.kilometers_driven ? String(carData.kilometers_driven) : '',
            price: carData.price ? String(carData.price) : '',
            photos: mappedPhotos.map(p => p.cloudinaryUrl),
            coverPhotoIndex: mappedPhotos.findIndex(p => p.isCover) || 0,
            phoneVerified: true,
            termsAccepted: false,
          }));
          setIsEditMode(true);
          setEditingListingId(editCarId);
        } catch (err: any) {
          setEditError('Failed to load car for editing');
          toast({
            title: 'Error',
            description: 'Failed to load car details',
            variant: 'destructive',
          });
        } finally {
          setEditLoading(false);
        }
      })();
    }
  }, [searchParams, user, setFormData, toast, navigate]);

  useEffect(() => {
    // Fetch the real count of active car listings for the user
    const fetchActiveCarListings = async () => {
      if (!user?.id) {
        setActiveCarListings(0);
        return;
      }
      const { count, error } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id)
        .eq('status', 'active');
      if (!error && typeof count === 'number') {
        setActiveCarListings(count);
      } else {
        setActiveCarListings(0);
      }
    };
    fetchActiveCarListings();
  }, [user?.id]);

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

  const handleSubmit = async () => {
    
    // Validate required fields
    if (!user) {
      toast({ 
        title: "Please sign in", 
        description: "You need to be signed in to post a car",
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.make || !formData.model || !formData.year) {
      toast({ 
        title: "Please complete car details", 
        description: "Make, model, and year are required",
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.city || !formData.phone) {
      toast({
        title: "Please complete location details", 
        description: "City and phone number are required",
        variant: "destructive" 
      });
      return;
    }
    
    if (!formData.price) {
      toast({ 
        title: "Please add pricing", 
        description: "Car price is required",
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
    
    // Check car listing limit before submission (only for new listings)
    if (!isEditMode && !canPostMoreCars(activeCarListings, userType)) {
      const upgradeMessage = getUpgradeMessage(activeCarListings, userType);
      const message = upgradeMessage 
        ? `${upgradeMessage.message} ${upgradeMessage.suggestion}`
        : `You've reached your limit of ${carLimit} car listings. Remove an old listing to post a new one.`;
      
      toast({
        title: "Listing Limit Reached",
        description: message,
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate API call or call your carService here
      // await carService.submitCar(formData);
      toast({
        title: isEditMode ? "Listing Updated!" : "Car Posted Successfully!",
        description: isEditMode
          ? "Your car listing has been updated."
          : "Your car listing is now live and buyers can contact you.",
      });
      // Clear form/sessionStorage and navigate home
      sessionStorage.removeItem('sellCarFormData');
      navigate('/');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error posting your car. Please try again.",
        variant: "destructive"
      });
    }
  };

  // --- Add handleBackToHome ---
  const handleBackToHome = () => {
    navigate('/');
  };

  // --- Return all necessary values ---
  return {
    currentStep,
    formData,
    setFormData,
    updateFormData,
    activeCarListings,
    carLimit,
    isEditMode,
    validatePrice,
    validateKilometersDriven,
    handleNext,
    handlePrevious,
    handlePhoneVerification,
    handleSubmit,
    handleBackToHome,
    user,
    userType,
    clearFormData: () => {
      sessionStorage.removeItem('sellCarFormData');
      setFormData({
        make: '',
        model: '',
        variant: '',
        year: '',
        registrationYear: '',
        registrationState: '',
        fitnessCertificateValidTill: '',
        numberOfOwners: '1',
        seatingCapacity: '5',
        fuelType: '',
        transmission: '',
        kilometersDriven: '',
        color: '',
        price: '',
        acceptOffers: true,
        offerPercentage: '70',
        insuranceValidTill: '',
        insuranceType: 'Comprehensive',
        insuranceValid: false,
        lastServiceDate: '',
        serviceCenterType: '',
        serviceHistory: false,
        authorizedServiceCenter: false,
        rtoTransferSupport: false,
        noAccidentHistory: false,
        isRentAvailable: false,
        dailyRate: '',
        weeklyRate: '',
        securityDeposit: '',
        photos: [],
        coverPhotoIndex: 0,
        city: '',
        area: '',
        landmark: '',
        phone: user?.phone || '',
        phoneVerified: false,
        description: '',
        termsAccepted: false,
        address: '',
        sellerName: '',
        email: '',
        seller_type: userType as 'individual' | 'dealer'
      });
      setCurrentStep(1);
    },
    canSubmit: () => (
      formData.termsAccepted &&
      formData.make &&
      formData.model &&
      formData.year &&
      formData.city &&
      formData.phone &&
      formData.price
    )
  };
};
