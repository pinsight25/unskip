
import { useState } from 'react';

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
    mileage: '',
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
    // Car Features
    features: {
      sunroof: false,
      alloyWheels: false,
      reverseCamera: false,
      pushStart: false,
      musicSystem: false,
      powerSteering: false,
      powerWindows: false,
      airConditioning: false,
    },
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
