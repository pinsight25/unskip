
export interface RentCar {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  images: string[];
  rentPrice: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  securityDeposit: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  location: string;
  description: string;
  seller: RentSeller;
  rentType: 'economy' | 'premium' | 'luxury' | 'suv';
  features: string[];
  policies: {
    fuelPolicy: 'full-to-full' | 'pay-for-fuel';
    kmLimit: number;
    insuranceIncluded: boolean;
    minRentalPeriod: number; // in days
  };
  availability: {
    available: boolean;
    nextAvailableDate?: string;
  };
  verified: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
}

export interface RentSeller {
  id: string;
  name: string;
  type: 'individual' | 'rental-company';
  phone: string;
  email: string;
  verified: boolean;
  rating: number;
  totalRentals: number;
  memberSince: string;
  avatar?: string;
  businessName?: string;
  location: string;
}

export interface RentFilters {
  search: string;
  dailyPriceRange: [number, number];
  duration: 'all' | 'daily' | 'weekly' | 'monthly';
  carType: 'all' | 'economy' | 'premium' | 'luxury' | 'suv';
  availableFrom?: Date;
  availableTo?: Date;
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest';
}

export interface RentBooking {
  id: string;
  carId: string;
  renterName: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  securityDeposit: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}
