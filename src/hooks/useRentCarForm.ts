
import { useState } from 'react';
import { updateFormField } from '@/utils/formHelpers';

export const useRentCarForm = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    variant: '',
    year: '',
    fuelType: '',
    transmission: '',
    mileage: '',
    color: '',
    price: '',
    isRentAvailable: true, // Default to true for rent-focused form
    dailyRate: '',
    weeklyRate: '',
    minRentalPeriod: '1',
    securityDeposit: '',
    photos: [] as string[],
    coverPhotoIndex: 0,
    area: '',
    landmark: '',
    phone: '',
    phoneVerified: false,
    description: '',
    acceptOffers: false,
    offerPercentage: '10',
    termsAccepted: false
  });

  const validatePrice = (price: string) => {
    const priceNum = Number(price);
    if (priceNum < 50000) return { valid: false, message: 'Price seems too low for a car' };
    if (priceNum > 10000000) return { valid: false, message: 'Price seems unusually high' };
    return { valid: true, message: '' };
  };

  const validateMileage = (mileage: string) => {
    const mileageNum = Number(mileage);
    if (mileageNum > 300000) return { valid: false, message: 'Mileage seems unusually high' };
    if (mileageNum < 100 && formData.year && Number(formData.year) < 2023) return { valid: false, message: 'Mileage seems too low for car age' };
    return { valid: true, message: '' };
  };

  return {
    formData,
    setFormData,
    validatePrice,
    validateMileage
  };
};
