
import { Car } from '@/types/car';
import { sellers } from '../sellers';

export const luxuryCars: Car[] = [
  {
    id: '4',
    title: '2021 Tata Nexon EV',
    brand: 'Tata',
    model: 'Nexon EV',
    variant: 'XZ+',
    year: 2021,
    price: 1200000,
    images: [
      'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ],
    mileage: 15000,
    kilometersDriven: 15000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    ownership: 1,
    ownershipNumber: 1,
    location: 'Velachery, Chennai',
    color: 'Blue',
    seatingCapacity: 5,
    description: 'Electric SUV with excellent range. Perfect for eco-conscious buyers.',
    seller: sellers[3],
    registrationYear: 2021,
    registrationState: 'TN - Tamil Nadu',
    noAccidentHistory: true,
    acceptOffers: true,
    offerPercentage: 70,
    insuranceValid: true,
    insuranceValidTill: '2024-11-25',
    insuranceType: 'Comprehensive',
    lastServiceDate: '2023-11-20',
    serviceAtAuthorized: true,
    rtoTransferSupport: true,
    isRentAvailable: true,
    rentPrice: {
      daily: 2800,
      weekly: 18000,
      monthly: 55000
    },
    rentPolicies: {
      securityDeposit: 20000,
      fuelPolicy: 'full-to-full',
      kmLimit: 180,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    rentType: 'premium',
    verified: true,
    featured: false,
    views: 189,
    createdAt: '2024-01-05T16:45:00Z'
  },
  {
    id: '6',
    title: '2020 BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    variant: '320d',
    year: 2020,
    price: 3200000,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    mileage: 25000,
    kilometersDriven: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownership: 1,
    ownershipNumber: 1,
    location: 'ECR, Chennai',
    color: 'Black',
    seatingCapacity: 5,
    description: 'Luxury sedan in pristine condition. Full service history available.',
    seller: sellers[1],
    registrationYear: 2020,
    registrationState: 'TN - Tamil Nadu',
    noAccidentHistory: true,
    acceptOffers: true,
    offerPercentage: 85,
    insuranceValid: true,
    insuranceValidTill: '2024-09-10',
    insuranceType: 'Comprehensive',
    lastServiceDate: '2023-09-15',
    serviceAtAuthorized: true,
    rtoTransferSupport: true,
    isRentAvailable: true,
    rentPrice: {
      daily: 6500,
      weekly: 42000,
      monthly: 150000
    },
    rentPolicies: {
      securityDeposit: 50000,
      fuelPolicy: 'pay-for-fuel',
      kmLimit: 200,
      insuranceIncluded: true,
      minRentalPeriod: 2
    },
    rentType: 'luxury',
    verified: true,
    featured: true,
    views: 567,
    createdAt: '2024-01-14T15:30:00Z'
  }
];
