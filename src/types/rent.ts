
import { Car, Seller } from './car';

// Use the unified Car interface for rental cars
export interface RentCar extends Car {
  // All rental-specific properties are now part of the base Car interface
  rentPrice: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  securityDeposit: number;
  rentType: 'economy' | 'premium' | 'luxury' | 'suv';
  features: string[];
  policies: {
    fuelPolicy: 'full-to-full' | 'pay-for-fuel';
    kmLimit: number;
    insuranceIncluded: boolean;
    minRentalPeriod: number;
  };
  availability: {
    available: boolean;
    nextAvailableDate?: string;
  };
}

export interface RentSeller extends Seller {
  type: 'individual' | 'rental-company';
  totalRentals: number;
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
