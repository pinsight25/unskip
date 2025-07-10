
import { useState } from 'react';
import { updateFormField } from '@/utils/formHelpers';

export interface AccessoryFormData {
  name: string;
  category: string;
  brand: string;
  priceMin: string;
  priceMax: string;
  description: string;
  condition: string;
  compatibility: string[];
  warranty: string;
  installationAvailable: boolean;
  photos: string[];
  phone: string;
  phoneVerified: boolean;
  email: string;
  location: string;
  images: string[];
  additionalInfo: string;
  whatsappContact: boolean;
  verifiedSeller: boolean;
  sellerName: string; // Added seller name field
}

export const useAccessoryForm = () => {
  const [formData, setFormData] = useState<AccessoryFormData>({
    name: '',
    category: '',
    brand: '',
    priceMin: '',
    priceMax: '',
    description: '',
    condition: '',
    compatibility: [],
    warranty: '',
    installationAvailable: false,
    photos: [],
    phone: '',
    phoneVerified: false,
    email: '',
    location: '',
    images: [],
    additionalInfo: '',
    whatsappContact: false,
    verifiedSeller: false,
    sellerName: '', // Initialize seller name
  });

  const updateFormData = (field: keyof AccessoryFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const validateStep = (step: number): boolean => {
    console.log(`Validating accessory step ${step}:`, formData);
    
    switch (step) {
      case 1:
        const step1Valid = !!(
          formData.name?.trim() && 
          formData.category?.trim() && 
          formData.brand?.trim() && 
          formData.priceMin?.trim() &&
          parseFloat(formData.priceMin) > 0
        );
        console.log('Accessory Step 1 validation:', {
          name: !!formData.name?.trim(),
          category: !!formData.category?.trim(),
          brand: !!formData.brand?.trim(),
          priceMin: !!formData.priceMin?.trim(),
          priceMinValid: parseFloat(formData.priceMin) > 0,
          result: step1Valid
        });
        return step1Valid;
        
      case 2:
        const step2Valid = !!(
          formData.description?.trim() && 
          formData.condition?.trim()
        );
        console.log('Accessory Step 2 validation:', {
          description: !!formData.description?.trim(),
          condition: !!formData.condition?.trim(),
          result: step2Valid
        });
        return step2Valid;
        
      case 3:
        // Phone number validation - accept various formats
        const phoneValid = formData.phone?.trim() && 
          (formData.phone.replace(/\D/g, '').length >= 10);
        // Name validation
        const nameValid = formData.sellerName?.trim();
        const step3Valid = !!(
          phoneValid &&
          nameValid &&
          formData.location?.trim()
        );
        console.log('Accessory Step 3 validation:', {
          phone: formData.phone,
          phoneValid,
          phoneDigits: formData.phone?.replace(/\D/g, '').length,
          sellerName: !!formData.sellerName?.trim(),
          location: !!formData.location?.trim(),
          result: step3Valid
        });
        return step3Valid;
        
      default:
        return false;
    }
  };

  return {
    formData,
    updateFormData,
    validateStep,
  };
};
