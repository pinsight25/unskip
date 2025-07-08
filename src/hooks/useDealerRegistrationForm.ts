
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  operatingHours: string;
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
    operatingHours: '',
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

  const validateGST = (gst: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        return formData.businessName && formData.contactPerson && formData.phone && 
               formData.email && formData.businessCategory && formData.brandsDealWith.length > 0;
      case 2:
        return formData.gstNumber && validateGST(formData.gstNumber) && formData.shopAddress && 
               formData.pincode && formData.establishmentYear;
      case 3:
        return formData.documents.gstCertificate && formData.documents.shopLicense && 
               formData.documents.shopPhotos.length > 0 && formData.agreeToTerms;
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
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 2-3 business days.",
      });
      
      setTimeout(() => {
        navigate('/dealers');
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
  };
};
