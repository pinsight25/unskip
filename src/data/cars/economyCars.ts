
import { Car } from '@/types/car';
import { sellers } from '../sellers';

export const economyCars: Car[] = [
  {
    id: '1',
    title: '2019 Maruti Swift VDI',
    brand: 'Maruti',
    model: 'Swift',
    year: 2019,
    price: 650000,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
    ],
    mileage: 28000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    ownership: 1,
    location: 'T. Nagar, Chennai',
    landmark: 'Near Landmark Mall',
    color: 'White',
    description: 'Well maintained Swift with complete service history. Single owner, non-accidental.',
    seller: sellers[0],
    registrationYear: 2019,
    registrationState: 'TN - Tamil Nadu',
    insurance: {
      validTill: '2024-08-15',
      type: 'Comprehensive'
    },
    serviceHistory: {
      lastServiceDate: '2024-01-10',
      authorizedCenter: true
    },
    rtoTransferSupport: true,
    isRentAvailable: true,
    rentPrice: {
      daily: 1800,
      weekly: 11000,
      monthly: 35000
    },
    rentPolicies: {
      securityDeposit: 10000,
      fuelPolicy: 'full-to-full',
      kmLimit: 200,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    rentType: 'economy',
    features: ['AC', 'Power Steering', 'Music System', 'Clean Interior'],
    verified: true,
    featured: true,
    views: 234,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '3',
    title: '2018 Honda City VX',
    brand: 'Honda',
    model: 'City',
    year: 2018,
    price: 950000,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    mileage: 45000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownership: 2,
    location: 'Adyar, Chennai',
    color: 'Black',
    description: 'Reliable sedan with automatic transmission. Great for city driving.',
    seller: sellers[0],
    registrationYear: 2018,
    registrationState: 'TN - Tamil Nadu',
    insurance: {
      validTill: '2024-06-30',
      type: 'Third Party'
    },
    serviceHistory: {
      lastServiceDate: '2023-10-15',
      authorizedCenter: false
    },
    rtoTransferSupport: false,
    verified: false,
    featured: false,
    views: 123,
    createdAt: '2024-01-08T09:15:00Z'
  }
];
