
import { useState } from 'react';
import { updateFormField } from '@/utils/formHelpers';

export const useSellCarForm = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    variant: '',
    year: '',
    registrationYear: '',
    registrationState: '',
    numberOfOwners: '1',
    seatingCapacity: '5',
    fuelType: '',
    transmission: '',
    kilometersDriven: '',
    color: '',
    price: '',
    acceptOffers: true, // Smart default ON
    offerPercentage: '70', // Smart default 70%
    insuranceValidTill: '',
    insuranceType: 'Comprehensive', // Smart default
    lastServiceDate: '',
    authorizedServiceCenter: false,
    rtoTransferSupport: true, // Smart default checked
    noAccidentHistory: false, // New field
    isRentAvailable: false,
    dailyRate: '',
    weeklyRate: '',
    securityDeposit: '',
    photos: [] as string[],
    coverPhotoIndex: 0,
    area: '',
    landmark: '',
    phone: '',
    phoneVerified: false,
    description: '',
    termsAccepted: false
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
