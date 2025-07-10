
import { useState } from 'react';
import { updateFormField } from '@/utils/formHelpers';

export type SellCarFormData = {
  make: string;
  model: string;
  variant: string;
  year: string;
  registrationYear: string;
  registrationState: string;
  fitnessCertificateValidTill: string;
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
  insuranceValid: boolean;
  lastServiceDate: string;
  serviceCenterType: string;
  serviceHistory: boolean;
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
  // Fields for LocationContactStep
  address: string;
  sellerName: string;
  email: string;
};

export const useSellCarForm = () => {
  const [formData, setFormData] = useState<SellCarFormData>({
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
    serviceCenterType: 'Authorized',
    serviceHistory: false,
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
    // Fields for LocationContactStep
    address: '',
    sellerName: '',
    email: '',
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
