
import { useState } from 'react';
import { updateFormField } from '@/utils/formHelpers';

export type SellCarFormData = {
  make: string;
  model: string;
  variant: string;
  year: string;
  registrationYear: string;
  registrationState: string;
  fitnessCertificateValidTill: string; // New field
  numberOfOwners: string;
  seatingCapacity: string;
  fuelType: string;
  transmission: string;
  kilometersDriven: string;
  color: string;
  price: string;
  acceptOffers: boolean;
  offerPercentage: string;
  insuranceValidTill: string;
  insuranceType: string;
  insuranceValid: boolean; // New field to track if insurance section is expanded
  lastServiceDate: string;
  serviceCenterType: string; // New field
  serviceHistory: boolean; // New field to track if service section is expanded
  authorizedServiceCenter: boolean;
  rtoTransferSupport: boolean;
  noAccidentHistory: boolean;
  isRentAvailable: boolean;
  dailyRate: string;
  weeklyRate: string;
  securityDeposit: string;
  photos: string[];
  coverPhotoIndex: number;
  city: string;
  area: string;
  landmark: string;
  phone: string;
  phoneVerified: boolean;
  description: string;
  termsAccepted: boolean;
  // Additional fields for LocationContactStep
  address: string;
  sellerName: string;
  email: string;
  additionalInfo: string;
  whatsappContact: boolean;
  verifiedSeller: boolean;
};

export const useSellCarForm = () => {
  const [formData, setFormData] = useState<SellCarFormData>({
    make: '',
    model: '',
    variant: '',
    year: '',
    registrationYear: '',
    registrationState: '',
    fitnessCertificateValidTill: '', // New field
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
    insuranceValid: false, // New field
    lastServiceDate: '',
    serviceCenterType: 'Authorized', // New field
    serviceHistory: false, // New field
    authorizedServiceCenter: false,
    rtoTransferSupport: true,
    noAccidentHistory: false,
    isRentAvailable: false,
    dailyRate: '',
    weeklyRate: '',
    securityDeposit: '',
    photos: [] as string[],
    coverPhotoIndex: 0,
    city: '',
    area: '',
    landmark: '',
    phone: '',
    phoneVerified: false,
    description: '',
    termsAccepted: false,
    // Additional fields for LocationContactStep
    address: '',
    sellerName: '',
    email: '',
    additionalInfo: '',
    whatsappContact: false,
    verifiedSeller: false,
  });

  const validatePrice = (price: string) => {
    const priceNum = Number(price);
    if (priceNum < 50000) return { valid: false, message: 'Price seems too low for a car' };
    if (priceNum > 10000000) return { valid: false, message: 'Price seems unusually high' };
    return { valid: true, message: '' };
  };

  const validateKilometersDriven = (kilometers: string) => {
    const kmNum = Number(kilometers);
    if (kmNum > 300000) return { valid: false, message: 'Kilometers driven seems unusually high' };
    if (kmNum < 100 && formData.year && Number(formData.year) < 2023) return { valid: false, message: 'Kilometers driven seems too low for car age' };
    return { valid: true, message: '' };
  };

  return {
    formData,
    setFormData,
    validatePrice,
    validateKilometersDriven
  };
};
