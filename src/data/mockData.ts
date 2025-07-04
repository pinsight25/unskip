
import { Car, Seller } from '@/types/car';

export const mockSellers: Seller[] = [
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
    name: 'Priya Singh',
    type: 'individual',
    phone: '+91 98765 43212',
    email: 'priya@example.com',
    verified: false,
    rating: 4.5,
    totalSales: 1,
    memberSince: '2023-08-10',
    location: 'Adyar, Chennai'
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
  },
  {
    id: '5',
    name: 'Suresh Anand',
    type: 'individual',
    phone: '+91 98765 43214',
    email: 'suresh@example.com',
    verified: true,
    rating: 4.6,
    totalSales: 2,
    memberSince: '2022-11-20',
    location: 'OMR, Chennai'
  },
  {
    id: '6',
    name: 'Elite Cars Chennai',
    type: 'dealer',
    phone: '+91 98765 43215',
    email: 'sales@elitecars.com',
    verified: true,
    rating: 4.8,
    totalSales: 134,
    memberSince: '2019-08-15',
    businessName: 'Elite Cars Chennai',
    location: 'ECR, Chennai'
  }
];

export const mockCars: Car[] = [
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
    description: 'Well maintained Swift with complete service history. Single owner, non-accidental.',
    seller: mockSellers[0],
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
    description: 'Premium SUV in excellent condition. All features working perfectly.',
    seller: mockSellers[1],
    isRentAvailable: true,
    rentPrice: {
      daily: 2500,
      weekly: 15000
    },
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
    description: 'Reliable sedan with automatic transmission. Great for city driving.',
    seller: mockSellers[2],
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
    description: 'Electric SUV with excellent range. Perfect for eco-conscious buyers.',
    seller: mockSellers[3],
    isRentAvailable: true,
    rentPrice: {
      daily: 3000,
      weekly: 18000
    },
    verified: true,
    featured: false,
    views: 89,
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
    description: 'Latest model XUV700 with all premium features. Excellent condition.',
    seller: mockSellers[4],
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
    description: 'Luxury sedan in pristine condition. Full service history available.',
    seller: mockSellers[5],
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
    description: 'Perfect family MPV with excellent reliability. Well maintained.',
    seller: mockSellers[1],
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
    description: 'Stylish compact SUV with modern features. Single owner.',
    seller: mockSellers[3],
    isRentAvailable: true,
    rentPrice: {
      daily: 2200,
      weekly: 13000
    },
    verified: true,
    featured: false,
    views: 145,
    createdAt: '2024-01-07T16:10:00Z'
  }
];

export const pricingTiers = {
  dealer: {
    free: {
      name: 'Free Plan',
      price: 0,
      features: [
        'List up to 5 cars',
        'Basic photo upload',
        'Standard support',
        'Basic analytics'
      ]
    },
    premium: [
      {
        name: 'Priority Placement',
        price: 500,
        period: 'month',
        description: 'Your listings appear at the top of search results'
      },
      {
        name: 'Featured Listings',
        price: 200,
        period: 'listing',
        description: 'Highlight individual cars with special badges'
      },
      {
        name: 'Bulk Upload',
        price: 300,
        period: 'month',
        description: 'Upload multiple cars at once via CSV'
      },
      {
        name: 'Advanced Analytics',
        price: 400,
        period: 'month',
        description: 'Detailed insights on views, leads, and performance'
      }
    ]
  }
};
