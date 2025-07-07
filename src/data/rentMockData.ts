
import { getCarsForRent, unifiedSellers } from './unifiedCarData';
import { RentCar, RentSeller } from '@/types/rent';

// Convert unified sellers to rent sellers
export const mockRentSellers: RentSeller[] = unifiedSellers.map(seller => ({
  ...seller,
  type: seller.type === 'dealer' ? 'rental-company' : 'individual',
  totalRentals: seller.totalSales
})) as RentSeller[];

// Convert unified cars to rent cars with additional rental-specific properties
export const mockRentCars: RentCar[] = getCarsForRent().map(car => ({
  ...car,
  rentPrice: {
    daily: car.rentPrice!.daily,
    weekly: car.rentPrice!.weekly,
    monthly: car.rentPrice!.monthly || car.rentPrice!.weekly * 4
  },
  securityDeposit: car.rentPolicies!.securityDeposit,
  rentType: car.rentType!,
  features: car.features || [],
  policies: {
    fuelPolicy: car.rentPolicies!.fuelPolicy,
    kmLimit: car.rentPolicies!.kmLimit,
    insuranceIncluded: car.rentPolicies!.insuranceIncluded,
    minRentalPeriod: car.rentPolicies!.minRentalPeriod
  },
  availability: {
    available: true
  },
  seller: mockRentSellers.find(s => s.id === car.seller.id) || mockRentSellers[0]
}));
