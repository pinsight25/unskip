
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
  warranty: string; // New field
  installationAvailable: boolean; // New field
  photos: string[];
  phone: string;
  phoneVerified: boolean;
  email: string;
  location: string;
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
    warranty: '', // New field
    installationAvailable: false, // New field
    photos: [],
    phone: '',
    phoneVerified: false,
    email: '',
    location: '',
  });

  const updateFormData = (field: keyof AccessoryFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.category && formData.brand && formData.priceMin);
      case 2:
        return !!(formData.description && formData.condition);
      case 3:
        return !!(formData.phone && formData.location);
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
