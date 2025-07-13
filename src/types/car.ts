export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  images: string[];
  mileage: number; // Keep for backward compatibility
  kilometersDriven: number; // New field name we're using
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  ownership: number; // Keep for backward compatibility  
  ownershipNumber: number; // New field name we're using
  location: string;
  description: string;
  seller: Seller;
  seller_type: 'individual' | 'dealer';
  color?: string;
  landmark?: string;
  seatingCapacity?: number;
  isRentAvailable?: boolean;
  rentPrice?: {
    daily: number;
    weekly: number;
    monthly?: number;
  };
  rentPolicies?: {
    securityDeposit: number;
    fuelPolicy: 'full-to-full' | 'pay-for-fuel';
    kmLimit: number;
    insuranceIncluded: boolean;
    minRentalPeriod: number;
  };
  rentType?: 'economy' | 'premium' | 'luxury' | 'suv';
  verified: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  // Fields from Sell Car form - flat structure to match components
  registrationYear?: number;
  registrationState?: string;
  fitnessCertificateValidTill?: string; // New field
  noAccidentHistory?: boolean;
  acceptOffers?: boolean;
  offerPercentage?: number;
  insuranceValid?: boolean;
  insuranceValidTill?: string;
  insuranceType?: 'Comprehensive' | 'Third Party';
  lastServiceDate?: string;
  serviceCenterType?: 'Authorized' | 'Local Garage'; // New field
  serviceAtAuthorized?: boolean;
  rtoTransferSupport?: boolean;
  // Legacy nested structures for backward compatibility
  insurance?: {
    validTill: string;
    type: 'Comprehensive' | 'Third Party';
  };
  serviceHistory?: {
    lastServiceDate?: string;
    authorizedCenter: boolean;
  };
}

export interface Seller {
  id: string;
  name: string;
  type: 'individual' | 'dealer';
  phone: string;
  email: string;
  verified: boolean;
  dealerVerified?: boolean;
  rating: number;
  totalSales: number;
  memberSince: string;
  avatar?: string;
  businessName?: string;
  location: string;
}

export interface Offer {
  id: string;
  carId: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface PricingAlert {
  type: 'warning' | 'blocked' | 'fair';
  message: string;
  percentageDiff: number;
}
