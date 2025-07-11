
export interface CarListing {
  id: string;
  title: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  city: string;
  views: number;
  status: string;
  created_at: string;
  // All other car fields for editing/duplicating
  registrationYear?: number;
  registrationState?: string;
  fitnessCertificateValidTill?: string;
  numberOfOwners?: number;
  seatingCapacity?: number;
  fuelType?: string;
  transmission?: string;
  kilometersDriven?: number;
  color?: string;
  acceptOffers?: boolean;
  offerPercentage?: number;
  insuranceValidTill?: string;
  insuranceType?: string;
  insuranceValid?: boolean;
  lastServiceDate?: string;
  serviceCenterType?: string;
  serviceHistory?: boolean;
  authorizedServiceCenter?: boolean;
  rtoTransferSupport?: boolean;
  noAccidentHistory?: boolean;
  isRentAvailable?: boolean;
  dailyRate?: number;
  weeklyRate?: number;
  securityDeposit?: number;
  area?: string;
  landmark?: string;
  description?: string;
}

export interface AccessoryListing {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_min: number;
  price_max: number;
  location: string;
  views: number;
  status: string;
  created_at: string;
  type: 'accessory';
  // Convert for compatibility
  price: { min: number; max: number };
  postedDate: string;
  images: string[];
}

export interface UserStats {
  totalCars: number;
  activeCars: number;
  totalAccessories: number;
  activeAccessories: number;
  totalViews: number;
}

export interface StatsRow {
  total_cars: number;
  active_cars: number;
  total_accessories: number;
  active_accessories: number;
  total_views: number;
}
