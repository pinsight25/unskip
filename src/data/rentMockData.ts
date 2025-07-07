
import { RentCar, RentSeller } from '@/types/rent';

export const mockRentSellers: RentSeller[] = [
  {
    id: 'r1',
    name: 'Chennai Car Rentals',
    type: 'rental-company',
    phone: '+91 98765 11111',
    email: 'info@chennaicarrentals.com',
    verified: true,
    rating: 4.8,
    totalRentals: 245,
    memberSince: '2020-01-15',
    businessName: 'Chennai Car Rentals Pvt Ltd',
    location: 'T. Nagar, Chennai'
  },
  {
    id: 'r2',
    name: 'Premium Rentals',
    type: 'rental-company',
    phone: '+91 98765 22222',
    email: 'bookings@premiumrentals.com',
    verified: true,
    rating: 4.9,
    totalRentals: 156,
    memberSince: '2019-03-20',
    businessName: 'Premium Rentals',
    location: 'Anna Nagar, Chennai'
  },
  {
    id: 'r3',
    name: 'Drive Easy',
    type: 'rental-company',
    phone: '+91 98765 33333',
    email: 'support@driveeasy.com',
    verified: true,
    rating: 4.7,
    totalRentals: 89,
    memberSince: '2021-06-12',
    businessName: 'Drive Easy Solutions',
    location: 'Velachery, Chennai'
  }
];

export const mockRentCars: RentCar[] = [
  {
    id: 'rent-1',
    title: '2022 Maruti Swift VXI - Perfect City Car',
    brand: 'Maruti',
    model: 'Swift',
    year: 2022,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
    ],
    rentPrice: {
      daily: 1800,
      weekly: 11000,
      monthly: 35000
    },
    securityDeposit: 10000,
    mileage: 15000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    location: 'T. Nagar, Chennai',
    description: 'Perfect for city drives and weekend trips. Excellent fuel efficiency.',
    seller: mockRentSellers[0],
    rentType: 'economy',
    features: ['AC', 'Power Steering', 'Music System', 'Clean Interior'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 200,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    availability: {
      available: true
    },
    verified: true,
    featured: false,
    views: 156,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'rent-2',
    title: '2021 Hyundai Creta SX - Premium SUV',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2021,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1494976688430-30aacd673f5c?w=800'
    ],
    rentPrice: {
      daily: 3200,
      weekly: 20000,
      monthly: 65000
    },
    securityDeposit: 25000,
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Anna Nagar, Chennai',
    description: 'Spacious SUV perfect for family trips and long drives.',
    seller: mockRentSellers[1],
    rentType: 'premium',
    features: ['Sunroof', 'Automatic AC', 'Touchscreen', 'Reverse Camera', 'Leather Seats'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 250,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    availability: {
      available: true
    },
    verified: true,
    featured: true,
    views: 234,
    createdAt: '2024-01-12T14:20:00Z'
  },
  {
    id: 'rent-3',
    title: '2020 BMW 3 Series - Luxury Experience',
    brand: 'BMW',
    model: '3 Series',
    year: 2020,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    rentPrice: {
      daily: 6500,
      weekly: 42000,
      monthly: 150000
    },
    securityDeposit: 50000,
    mileage: 22000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'ECR, Chennai',
    description: 'Ultimate luxury sedan for special occasions and business trips.',
    seller: mockRentSellers[1],
    rentType: 'luxury',
    features: ['Premium Sound', 'Heated Seats', 'Navigation', 'Ambient Lighting', 'Premium Interior'],
    policies: {
      fuelPolicy: 'pay-for-fuel',
      kmLimit: 200,
      insuranceIncluded: true,
      minRentalPeriod: 2
    },
    availability: {
      available: true
    },
    verified: true,
    featured: true,
    views: 189,
    createdAt: '2024-01-10T16:45:00Z'
  },
  {
    id: 'rent-4',
    title: '2022 Tata Nexon EV - Eco Friendly',
    brand: 'Tata',
    model: 'Nexon EV',
    year: 2022,
    images: [
      'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ],
    rentPrice: {
      daily: 2800,
      weekly: 18000,
      monthly: 55000
    },
    securityDeposit: 20000,
    mileage: 8000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    location: 'Velachery, Chennai',
    description: 'Zero emission electric SUV with excellent range and modern features.',
    seller: mockRentSellers[2],
    rentType: 'premium',
    features: ['Electric', 'Fast Charging', 'Connected Car', 'Premium Audio', 'Digital Cluster'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 180,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    availability: {
      available: true
    },
    verified: true,
    featured: false,
    views: 145,
    createdAt: '2024-01-08T11:15:00Z'
  },
  {
    id: 'rent-5',
    title: '2021 Mahindra XUV700 - Adventure Ready',
    brand: 'Mahindra',
    model: 'XUV700',
    year: 2021,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1570733117311-d990c3816c47?w=800'
    ],
    rentPrice: {
      daily: 3800,
      weekly: 24000,
      monthly: 78000
    },
    securityDeposit: 30000,
    mileage: 12000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    location: 'OMR, Chennai',
    description: '7-seater SUV perfect for large families and adventure trips.',
    seller: mockRentSellers[0],
    rentType: 'suv',
    features: ['7 Seater', 'AWD', 'Panoramic Sunroof', 'ADAS', 'Premium Audio', '360 Camera'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 300,
      insuranceIncluded: true,
      minRentalPeriod: 2
    },
    availability: {
      available: false,
      nextAvailableDate: '2024-01-25'
    },
    verified: true,
    featured: true,
    views: 298,
    createdAt: '2024-01-05T09:30:00Z'
  },
  {
    id: 'rent-6',
    title: '2023 Honda City ZX - Comfortable Sedan',
    brand: 'Honda',
    model: 'City',
    year: 2023,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    rentPrice: {
      daily: 2400,
      weekly: 15000,
      monthly: 48000
    },
    securityDeposit: 15000,
    mileage: 5000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Adyar, Chennai',
    description: 'Brand new sedan with latest features and excellent comfort.',
    seller: mockRentSellers[1],
    rentType: 'premium',
    features: ['Lane Watch Camera', 'Cruise Control', 'Touchscreen', 'Remote Start', 'Premium Interior'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 220,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    availability: {
      available: true
    },
    verified: true,
    featured: false,
    views: 178,
    createdAt: '2024-01-14T13:45:00Z'
  },
  {
    id: 'rent-7',
    title: '2020 Kia Seltos HTX - Stylish SUV',
    brand: 'Kia',
    model: 'Seltos',
    year: 2020,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1494976688430-30aacd673f5c?w=800'
    ],
    rentPrice: {
      daily: 2600,
      weekly: 16500,
      monthly: 52000
    },
    securityDeposit: 18000,
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Tambaram, Chennai',
    description: 'Trendy compact SUV with modern design and great features.',
    seller: mockRentSellers[2],
    rentType: 'premium',
    features: ['UVO Connect', 'Air Purifier', 'Wireless Charging', 'Bose Audio', 'LED Headlights'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 200,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    availability: {
      available: true
    },
    verified: true,
    featured: false,
    views: 167,
    createdAt: '2024-01-11T15:20:00Z'
  },
  {
    id: 'rent-8',
    title: '2019 Toyota Innova Crysta - Family Comfort',
    brand: 'Toyota',
    model: 'Innova Crysta',
    year: 2019,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1570733117311-d990c3816c47?w=800'
    ],
    rentPrice: {
      daily: 3000,
      weekly: 19000,
      monthly: 60000
    },
    securityDeposit: 22000,
    mileage: 35000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    location: 'Chromepet, Chennai',
    description: 'Reliable 7-seater MPV perfect for family outings and group travel.',
    seller: mockRentSellers[0],
    rentType: 'suv',
    features: ['7 Seater', 'Captain Seats', 'Dual AC', 'Touchscreen', 'Reliable Engine'],
    policies: {
      fuelPolicy: 'full-to-full',
      kmLimit: 250,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    availability: {
      available: true
    },
    verified: true,
    featured: false,
    views: 201,
    createdAt: '2024-01-09T12:00:00Z'
  }
];
