import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { updateFormField } from '@/utils/formHelpers';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/utils/uploadHelpers';

const STORAGE_KEY = 'dealerRegistrationFormData';

export interface DealerFormData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessCategory: string;
  brandsDealWith: string[];
  specialization: string;
  gstNumber: string;
  shopAddress: string;
  pincode: string;
  establishmentYear: string;
  websiteUrl: string;
  googleMapsLink: string;
  operatingHours: {
    openingTime: string;
    closingTime: string;
    is24x7: boolean;
  };
  documents: {
    gstCertificate: File | null;
    shopLicense: File | null;
    shopPhotos: File[];
  };
  agreeToTerms: boolean;
}

export const useDealerRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormDataState] = useState<DealerFormData>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Files cannot be persisted, so reset them
        if (parsed.documents) {
          parsed.documents.gstCertificate = null;
          parsed.documents.shopLicense = null;
          parsed.documents.shopPhotos = [];
        }
        return parsed;
      } catch (e) {
        return {
          businessName: '',
          contactPerson: '',
          phone: '',
          email: '',
          businessCategory: '',
          brandsDealWith: [],
          specialization: '',
          gstNumber: '',
          shopAddress: '',
          pincode: '',
          establishmentYear: '',
          websiteUrl: '',
          googleMapsLink: '',
          operatingHours: {
            openingTime: '',
            closingTime: '',
            is24x7: false,
          },
          documents: {
            gstCertificate: null,
            shopLicense: null,
            shopPhotos: [],
          },
          agreeToTerms: false,
        };
      }
    }
    return {
      businessName: '',
      contactPerson: '',
      phone: '',
      email: '',
      businessCategory: '',
      brandsDealWith: [],
      specialization: '',
      gstNumber: '',
      shopAddress: '',
      pincode: '',
      establishmentYear: '',
      websiteUrl: '',
      googleMapsLink: '',
      operatingHours: {
        openingTime: '',
        closingTime: '',
        is24x7: false,
      },
      documents: {
        gstCertificate: null,
        shopLicense: null,
        shopPhotos: [],
      },
      agreeToTerms: false,
    };
  });

  // Save to localStorage on every change (except files)
  useEffect(() => {
    const { documents, ...rest } = formData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, documents: { ...documents, gstCertificate: null, shopLicense: null, shopPhotos: [] } }));
  }, [formData]);

  // Helper to update form data and persist
  const setFormData = (updater: (prev: DealerFormData) => DealerFormData) => {
    setFormDataState(prev => {
      const updated = updater(prev);
      // Save to localStorage (except files)
      const { documents, ...rest } = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, documents: { ...documents, gstCertificate: null, shopLicense: null, shopPhotos: [] } }));
      return updated;
    });
  };

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Generate dealer slug from business name
  const generateDealerSlug = (businessName: string) => {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const validateGST = (gst: string) => {
    if (!gst || gst.length === 0) return false;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const handleInputChange = (field: keyof DealerFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'shopPhotos') {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: Array.from(files),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: files[0],
        },
      }));
    }
  };

  const validateStep = (step: number) => {
    
    switch (step) {
      case 1:
        const step1Valid = !!(
          formData.businessName?.trim() && 
          formData.contactPerson?.trim() && 
          formData.phone?.trim() && 
          formData.email?.trim() && 
          formData.businessCategory?.trim() && 
          formData.brandsDealWith?.length > 0 &&
          formData.specialization?.trim()
        );
        return step1Valid;
        
      case 2:
        const step2Valid = !!(
          formData.gstNumber?.trim() && 
          validateGST(formData.gstNumber) && 
          formData.shopAddress?.trim() && 
          formData.pincode?.trim() && 
          formData.establishmentYear?.trim()
        );
        return step2Valid;
        
      case 3:
        const step3Valid = !!(
          formData.documents.gstCertificate && 
          formData.documents.shopLicense && 
          formData.documents.shopPhotos?.length > 0 && 
          formData.agreeToTerms === true
        );
        return step3Valid;
        
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Please fill all required fields",
        description: "Complete all fields before proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Please fill all required fields",
        description: "Complete all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register as a dealer.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate slug from business name
      const slug = formData.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload documents to Cloudinary
      const gstCertUrl = await uploadToCloudinary(formData.documents.gstCertificate!, 'unskip/dealers/documents');
      const shopLicenseUrl = await uploadToCloudinary(formData.documents.shopLicense!, 'unskip/dealers/documents');
      const shopPhotosUrls = await uploadMultipleToCloudinary(formData.documents.shopPhotos, 'unskip/dealers/photos');

      // Insert into dealers table
      const { data: dealer, error } = await supabase
        .from('dealers')
        .insert({
          user_id: user.id,
          slug: slug,
          business_name: formData.businessName,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          email: formData.email,
          business_category: formData.businessCategory,
          specialization: formData.specialization,
          brands_deal_with: formData.brandsDealWith,
          gst_number: formData.gstNumber,
          shop_address: formData.shopAddress,
          pincode: formData.pincode,
          establishment_year: parseInt(formData.establishmentYear),
          gst_certificate_url: gstCertUrl,
          shop_license_url: shopLicenseUrl,
          shop_photos_urls: shopPhotosUrls,
          verification_status: 'pending',
          verified: false
        })
        .select()
        .single();
      if (error) throw error;

      // Update user as dealer
      await supabase
        .from('users')
        .update({ user_type: 'dealer' })
        .eq('id', user.id);

      toast({
        title: "Registration successful!",
        description: "Your dealer profile has been created and is pending verification. You can start posting cars immediately.",
      });

      // Clear saved form data
      localStorage.removeItem(STORAGE_KEY);

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error?.message || 'Failed to register. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    totalSteps,
    progress,
    formData,
    isSubmitting,
    validateGST,
    handleInputChange,
    handleFileUpload,
    validateStep,
    nextStep,
    prevStep,
    handleSubmit,
    setFormData,
  };
};
