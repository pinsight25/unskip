import { Car, Seller } from '@/types/car';

export const unifiedSellers: Seller[] = [
  {
    id: '1',
    name: 'Raj Kumar',
    type: 'individual',
    phone: '+91 98765 43210',
    email: 'raj@example.com',
    verified: true,
    rating: 4.8,
    totalSales: 3,
    memberSince: '2023-01-15',
    location: 'T. Nagar, Chennai'
  },
  {
    id: '2',
    name: 'Premium Motors',
    type: 'dealer',
    phone: '+91 98765 43211',
    email: 'sales@premiummotors.com',
    verified: true,
    rating: 4.9,
    totalSales: 156,
    memberSince: '2020-03-20',
    businessName: 'Premium Motors Chennai',
    location: 'Anna Nagar, Chennai'
  },
  {
    id: '3',
    name: 'Chennai Car Rentals',
    type: 'dealer',
    phone: '+91 98765 11111',
    email: 'info@chennaicarrentals.com',
    verified: true,
    rating: 4.8,
    totalSales: 245,
    memberSince: '2020-01-15',
    businessName: 'Chennai Car Rentals Pvt Ltd',
    location: 'T. Nagar, Chennai'
  },
  {
    id: '4',
    name: 'Chennai Auto Hub',
    type: 'dealer',
    phone: '+91 98765 43213',
    email: 'info@chennaiauto.com',
    verified: true,
    rating: 4.7,
    totalSales: 89,
    memberSince: '2021-06-12',
    businessName: 'Chennai Auto Hub',
    location: 'Velachery, Chennai'
  }
];

// Unified car data - single source of truth
export const unifiedCars: Car[] = [
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
    seller: unifiedSellers[0],
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
    id: '2',
    title: '2020 Hyundai Creta SX',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2020,
    price: 1450000,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1494976688430-30aacd673f5c?w=800'
    ],
    mileage: 35000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownership: 1,
    location: 'Anna Nagar, Chennai',
    landmark: 'Opposite Metro Station',
    color: 'Silver',
    description: 'Premium SUV in excellent condition. All features working perfectly.',
    seller: unifiedSellers[1],
    isRentAvailable: true,
    rentPrice: {
      daily: 3200,
      weekly: 20000,
      monthly: 65000
    },
    rentPolicies: {
      securityDeposit: 25000,
      fuelPolicy: 'full-to-full',
      kmLimit: 250,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    rentType: 'premium',
    features: ['Sunroof', 'Automatic AC', 'Touchscreen', 'Reverse Camera', 'Leather Seats'],
    verified: true,
    featured: true,
    views: 456,
    createdAt: '2024-01-10T14:20:00Z'
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
    ownership: 1,
    location: 'Adyar, Chennai',
    color: 'Black',
    description: 'Reliable sedan with automatic transmission. Great for city driving.',
    seller: unifiedSellers[0],
    verified: false,
    featured: false,
    views: 123,
    createdAt: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    title: '2021 Tata Nexon EV',
    brand: 'Tata',
    model: 'Nexon EV',
    year: 2021,
    price: 1200000,
    images: [
      'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=800',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
    ],
    mileage: 15000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    ownership: 1,
    location: 'Velachery, Chennai',
    color: 'Blue',
    description: 'Electric SUV with excellent range. Perfect for eco-conscious buyers.',
    seller: unifiedSellers[3],
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
    features: ['Electric', 'Fast Charging', 'Connected Car', 'Premium Audio', 'Digital Cluster'],
    verified: true,
    featured: false,
    views: 189,
    createdAt: '2024-01-05T16:45:00Z'
  },
  {
    id: '5',
    title: '2022 Mahindra XUV700',
    brand: 'Mahindra',
    model: 'XUV700',
    year: 2022,
    price: 1850000,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1570733117311-d990c3816c47?w=800'
    ],
    mileage: 12000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    ownership: 1,
    location: 'OMR, Chennai',
    color: 'Red',
    description: 'Latest model XUV700 with all premium features. Excellent condition.',
    seller: unifiedSellers[0],
    verified: true,
    featured: true,
    views: 312,
    createdAt: '2024-01-12T11:20:00Z'
  },
  {
    id: '6',
    title: '2020 BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    year: 2020,
    price: 3200000,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
    ],
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownership: 1,
    location: 'ECR, Chennai',
    color: 'Black',
    description: 'Luxury sedan in pristine condition. Full service history available.',
    seller: unifiedSellers[1],
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
    features: ['Premium Sound', 'Heated Seats', 'Navigation', 'Ambient Lighting', 'Premium Interior'],
    verified: true,
    featured: true,
    views: 567,
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '7',
    title: '2019 Toyota Innova Crysta',
    brand: 'Toyota',
    model: 'Innova Crysta',
    year: 2019,
    price: 1650000,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1570733117311-d990c3816c47?w=800'
    ],
    mileage: 38000,
    fuelType: 'Diesel',
    transmission: 'Manual',
    ownership: 1,
    location: 'Tambaram, Chennai',
    color: 'White',
    description: 'Perfect family MPV with excellent reliability. Well maintained.',
    seller: unifiedSellers[2],
    isRentAvailable: true,
    rentPrice: {
      daily: 3000,
      weekly: 19000,
      monthly: 60000
    },
    rentPolicies: {
      securityDeposit: 22000,
      fuelPolicy: 'full-to-full',
      kmLimit: 250,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    rentType: 'suv',
    features: ['7 Seater', 'Captain Seats', 'Dual AC', 'Touchscreen', 'Reliable Engine'],
    verified: true,
    featured: false,
    views: 189,
    createdAt: '2024-01-09T13:45:00Z'
  },
  {
    id: '8',
    title: '2021 Kia Seltos HTX',
    brand: 'Kia',
    model: 'Seltos',
    year: 2021,
    price: 1350000,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'https://images.unsplash.com/photo-1494976688430-30aacd673f5c?w=800'
    ],
    mileage: 22000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownership: 1,
    location: 'Chromepet, Chennai',
    color: 'Grey',
    description: 'Stylish compact SUV with modern features. Single owner.',
    seller: unifiedSellers[3],
    isRentAvailable: true,
    rentPrice: {
      daily: 2600,
      weekly: 16500,
      monthly: 52000
    },
    rentPolicies: {
      securityDeposit: 18000,
      fuelPolicy: 'full-to-full',
      kmLimit: 200,
      insuranceIncluded: true,
      minRentalPeriod: 1
    },
    rentType: 'premium',
    features: ['UVO Connect', 'Air Purifier', 'Wireless Charging', 'Bose Audio', 'LED Headlights'],
    verified: true,
    featured: false,
    views: 145,
    createdAt: '2024-01-07T16:10:00Z'
  }
];

// Filter cars for sale (all cars)
export const getCarsForSale = (): Car[] => {
  return unifiedCars;
};

// Filter cars available for rent
export const getCarsForRent = (): Car[] => {
  return unifiedCars.filter(car => car.isRentAvailable);
};
