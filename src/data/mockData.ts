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
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'
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
    seller: mockSellers[1],
    isRentAvailable: true,
    rentPrice: {
      daily: 3000,
      weekly: 18000
    },
    verified: true,
    featured: false,
    views: 89,
    createdAt: '2024-01-05T16:45:00Z'
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