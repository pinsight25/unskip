import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { updateFormField } from '@/utils/formHelpers';

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
  const [formData, setFormData] = useState<DealerFormData>({
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
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
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
    console.log(`Validating step ${step}:`, formData);
    
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
        console.log('Step 1 validation:', {
          businessName: !!formData.businessName?.trim(),
          contactPerson: !!formData.contactPerson?.trim(),
          phone: !!formData.phone?.trim(),
          email: !!formData.email?.trim(),
          businessCategory: !!formData.businessCategory?.trim(),
          brandsDealWith: formData.brandsDealWith?.length > 0,
          specialization: !!formData.specialization?.trim(),
          result: step1Valid
        });
        return step1Valid;
        
      case 2:
        const step2Valid = !!(
          formData.gstNumber?.trim() && 
          validateGST(formData.gstNumber) && 
          formData.shopAddress?.trim() && 
          formData.pincode?.trim() && 
          formData.establishmentYear?.trim()
        );
        console.log('Step 2 validation:', {
          gstNumber: !!formData.gstNumber?.trim(),
          gstValid: validateGST(formData.gstNumber),
          shopAddress: !!formData.shopAddress?.trim(),
          pincode: !!formData.pincode?.trim(),
          establishmentYear: !!formData.establishmentYear?.trim(),
          result: step2Valid
        });
        return step2Valid;
        
      case 3:
        const step3Valid = !!(
          formData.documents.gstCertificate && 
          formData.documents.shopLicense && 
          formData.documents.shopPhotos?.length > 0 && 
          formData.agreeToTerms === true
        );
        console.log('Step 3 validation:', {
          gstCertificate: !!formData.documents.gstCertificate,
          shopLicense: !!formData.documents.shopLicense,
          shopPhotos: formData.documents.shopPhotos?.length > 0,
          agreeToTerms: formData.agreeToTerms === true,
          result: step3Valid
        });
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

  const handleSubmit = () => {
    if (validateStep(3)) {
      console.log('Submitting dealer registration:', formData);
      
      const dealerSlug = generateDealerSlug(formData.businessName);
      
      toast({
        title: "Application Submitted!",
        description: "Your dealer profile has been created and is pending verification.",
      });
      
      setTimeout(() => {
        // Route to the new dealer page with pending status
        navigate(`/dealers/${dealerSlug}`);
      }, 2000);
    }
  };

  return {
    currentStep,
    totalSteps,
    progress,
    formData,
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
