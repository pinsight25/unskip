
import { useState } from 'react';

export interface AccessoryFormData {
  name: string;
  category: string;
  brand: string;
  priceMin: string;
  priceMax: string;
  description: string;
  condition: string;
  compatibility: string[];
  photos: string[];
  phone: string;
  phoneVerified: boolean;
  email: string;
  location: string;
  warranty: string;
  installationAvailable: boolean;
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
    photos: [],
    phone: '',
    phoneVerified: false,
    email: '',
    location: '',
    warranty: '',
    installationAvailable: false,
  });

  const updateFormData = (field: keyof AccessoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
