
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSellCarForm } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';
import { FREE_LIMITS, getCarLimit, canPostMoreCars, getUpgradeMessage } from '@/constants/limits';
import { carService } from '@/services/carService';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import type { TablesInsert } from '@/integrations/supabase/types';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

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
        // console.error('Failed to save:', error);
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
            make: carData.make || '',
            model: carData.model || '',
            variant: carData.variant || '',
            year: carData.year ? String(carData.year) : '',
            registrationYear: carData.registration_year ? String(carData.registration_year) : '',
            registrationState: carData.registration_state || '',
            fitnessCertificateValidTill: carData.fitness_certificate_valid_till || '',
            numberOfOwners: carData.number_of_owners ? String(carData.number_of_owners) : '1',
            seatingCapacity: carData.seating_capacity ? String(carData.seating_capacity) : '5',
            fuelType: carData.fuel_type || '',
            transmission: carData.transmission || '',
            kilometersDriven: carData.kilometers_driven ? String(carData.kilometers_driven) : '',
            color: carData.color || '',
            price: carData.price ? String(carData.price) : '',
            acceptOffers: carData.accept_offers ?? true,
            offerPercentage: carData.offer_percentage ? String(carData.offer_percentage) : '70',
            insuranceValidTill: carData.insurance_valid_till || '',
            insuranceType: carData.insurance_type || 'Comprehensive',
            insuranceValid: carData.insurance_valid ?? false,
            lastServiceDate: carData.last_service_date || '',
            serviceCenterType: carData.service_center_type || '',
            serviceHistory: carData.service_history ?? false,
            authorizedServiceCenter: carData.authorized_service_center ?? false,
            rtoTransferSupport: carData.rto_transfer_support ?? false,
            noAccidentHistory: carData.no_accident_history ?? false,
            isRentAvailable: carData.is_rent_available ?? false,
            dailyRate: carData.daily_rate ? String(carData.daily_rate) : '',
            weeklyRate: carData.weekly_rate ? String(carData.weekly_rate) : '',
            securityDeposit: carData.security_deposit ? String(carData.security_deposit) : '',
            address: carData.address || '',
            city: carData.city || '',
            area: carData.area || '',
            landmark: carData.landmark || '',
            description: carData.description || '',
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

  // Sync phoneVerified and user info with actual user status
  useEffect(() => {
    if (user && user.isVerified) {
      setFormData(prev => ({
        ...prev,
        phoneVerified: true,
        phone: formatPhoneForDB(user.phone),
        sellerName: user.name,
        email: user.email
      }));
      // DO NOT clear sessionStorage here; preserve form data through verification
    }
  }, [user, setFormData]);

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
      // Actual Supabase insert
      const carInsert: TablesInsert<'cars'> = {
        seller_id: user.id,
        title: `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make,
        model: formData.model,
        variant: formData.variant,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        city: formData.city,
        area: formData.area,
        registration_year: formData.registrationYear ? parseInt(formData.registrationYear) : null,
        registration_state: formData.registrationState,
        fitness_certificate_valid_till: formData.fitnessCertificateValidTill || null,
        number_of_owners: formData.numberOfOwners ? parseInt(formData.numberOfOwners) : 1,
        seating_capacity: formData.seatingCapacity ? parseInt(formData.seatingCapacity) : 5,
        fuel_type: formData.fuelType as TablesInsert<'cars'>['fuel_type'],
        transmission: formData.transmission as TablesInsert<'cars'>['transmission'],
        kilometers_driven: formData.kilometersDriven ? parseInt(formData.kilometersDriven) : 0,
        color: formData.color,
        accept_offers: formData.acceptOffers,
        offer_percentage: formData.offerPercentage ? parseInt(formData.offerPercentage) : 70,
        insurance_valid_till: formData.insuranceValidTill || null,
        insurance_type: formData.insuranceType as TablesInsert<'cars'>['insurance_type'],
        insurance_valid: formData.insuranceValid,
        last_service_date: formData.lastServiceDate || null,
        service_center_type: formData.serviceCenterType as TablesInsert<'cars'>['service_center_type'],
        service_history: formData.serviceHistory,
        authorized_service_center: formData.authorizedServiceCenter,
        rto_transfer_support: formData.rtoTransferSupport,
        no_accident_history: formData.noAccidentHistory,
        is_rent_available: formData.isRentAvailable,
        daily_rate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
        weekly_rate: formData.weeklyRate ? parseFloat(formData.weeklyRate) : null,
        security_deposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null,
        address: formData.address,
        landmark: formData.landmark,
        description: formData.description,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      let carId = null;
      let carError = null;
      if (editingListingId) {
        // UPDATE existing car
        const { error } = await supabase
          .from('cars')
          .update(carInsert)
          .eq('id', editingListingId);
        carId = editingListingId;
        carError = error;
        // Delete old images for this car
        await supabase.from('car_images').delete().eq('car_id', editingListingId);
      } else {
        // INSERT new car
      const { data, error } = await supabase
        .from('cars')
        .insert(carInsert)
        .select()
        .single();
        carId = data?.id;
        carError = error;
      }

      if (carError) {
        // console.error('Failed to save car:', carError);
        toast({
          title: "Error",
          description: "Failed to save car. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Insert car images after car is created or updated
      if (carId) {
        const nonNullPhotos: (string | { cloudinaryUrl?: string })[] = formData.photos.filter(isNotNull);
        const carImageRecords = nonNullPhotos.map((photo, index) => {
          if (typeof photo === 'object' && 'cloudinaryUrl' in photo && photo.cloudinaryUrl) {
            return {
              car_id: carId,
              image_url: photo.cloudinaryUrl,
              sort_order: index,
              is_cover: index === 0
            };
          } else {
            return {
              car_id: carId,
              image_url: photo as string,
          sort_order: index,
          is_cover: index === 0
            };
          }
        });
        if (carImageRecords.length > 0) {
        await supabase.from('car_images').insert(carImageRecords);
        }
      }

      // Store carPosted info in localStorage with timestamp and carId (only for new cars)
      if (!editingListingId && carId) {
        const postData = {
          timestamp: Date.now(),
          carId: carId
        };
        localStorage.setItem('carPosted', JSON.stringify(postData));

        // Set carsListUpdated flag for Home page refresh
        const carsListData = {
          timestamp: Date.now(),
          action: 'post',
          carId: carId
        };
        localStorage.setItem('carsListUpdated', JSON.stringify(carsListData));
        // console.log('Setting flags after car post:', {
        //   carPosted: postData,
        //   carsListUpdated: carsListData
        // });
      }

      // Clear form/sessionStorage and invalidate listings cache, then navigate to profile
      sessionStorage.removeItem('sellCarFormData');
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      navigate('/profile');
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

  // Add a function to clear form and sessionStorage when user starts a new listing or clicks 'Clear Form'
  const handleClearForm = () => {
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
    sessionStorage.removeItem('sellCarFormData');
  };

  // Delete car and its images
  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      // Delete car images first
      await supabase
        .from('car_images')
        .delete()
        .eq('car_id', carId);
      // Then delete the car
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['cars'] });
      await queryClient.invalidateQueries({ queryKey: ['userListings'] });
      toast({ title: 'Car deleted successfully', variant: 'default' });
    } catch (error) {
      // console.error('Delete failed:', error);
      toast({ title: 'Failed to delete car', variant: 'destructive' });
    }
  };

  // Type guard for non-null values
  function isNotNull<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }

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
    handleClearForm,
    handleDeleteCar,
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
