import { Accessory, AccessorySeller } from '@/types/accessory';

export const mockAccessorySellers: AccessorySeller[] = [
  {
    id: 'seller-acc-1',
    name: 'Raj Kumar',
    shopName: 'AutoStyle Hub',
    type: 'dealer',
    phone: '+91 98765 43210',
    email: 'raj@autostylehub.com',
    verified: true,
    totalSales: 245,
    memberSince: '2022-03-15',
    location: 'Delhi',
    gstNumber: '07AABCU9603R1ZX',
    specialization: ['alloy-wheels', 'seat-covers', 'led-lights'],
    brandsCarried: ['Sparco', 'Momo', 'Philips'],
    responseTime: '2 hours'
  },
  {
    id: 'seller-acc-2',
    name: 'Priya Singh',
    shopName: 'Car Comfort Zone',
    type: 'dealer',
    phone: '+91 87654 32109',
    email: 'priya@carcomfort.com',
    verified: true,
    totalSales: 156,
    memberSince: '2021-11-20',
    location: 'Mumbai',
    specialization: ['seat-covers', 'floor-mats', 'car-perfumes'],
    brandsCarried: ['3M', 'Ambi Pur', 'Elegant'],
    responseTime: '1 hour'
  },
  {
    id: 'seller-acc-3',
    name: 'Suresh Electronics',
    shopName: 'Tech Car Solutions',
    type: 'dealer',
    phone: '+91 76543 21098',
    email: 'info@techcarsolutions.com',
    verified: true,
    totalSales: 312,
    memberSince: '2020-06-10',
    location: 'Bangalore',
    specialization: ['infotainment', 'dash-cameras', 'parking-sensors'],
    brandsCarried: ['Pioneer', 'Kenwood', '70mai'],
    responseTime: '30 minutes'
  }
];

export const mockAccessories: Accessory[] = [
  {
    id: 'acc-1',
    name: 'Premium Leather Seat Covers',
    brand: 'Elegant',
    category: 'seat-covers',
    price: { min: 2999, max: 4999 },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'
    ],
    description: 'Premium quality leather seat covers with custom fit for your car. Water-resistant and easy to clean.',
    features: [
      'Genuine leather material',
      'Custom fit design',
      'Water resistant',
      'Easy installation',
      'Available in multiple colors'
    ],
    compatibility: ['Maruti Swift', 'Hyundai i20', 'Honda City', 'Tata Nexon'],
    availability: 'in-stock',
    seller: mockAccessorySellers[0],
    location: 'Delhi',
    views: 234,
    createdAt: '2024-01-10T10:00:00Z',
    featured: true,
    condition: 'new'
  },
  {
    id: 'acc-2',
    name: '15" Alloy Wheels Set',
    brand: 'Sparco',
    category: 'alloy-wheels',
    price: { min: 8999, max: 12999 },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'
    ],
    description: 'Lightweight alloy wheels with sporty design. Improves performance and gives your car a premium look.',
    features: [
      'Lightweight aluminum alloy',
      'Corrosion resistant',
      'Improved fuel efficiency',
      'Enhanced braking performance',
      'Sporty design'
    ],
    compatibility: ['Maruti Swift', 'Maruti Baleno', 'Hyundai i20', 'Honda Jazz'],
    availability: 'in-stock',
    seller: mockAccessorySellers[0],
    location: 'Delhi',
    views: 567,
    createdAt: '2024-01-08T14:30:00Z',
    featured: true,
    condition: 'new'
  },
  {
    id: 'acc-3',
    name: 'HD Dash Camera with Night Vision',
    brand: '70mai',
    category: 'dash-cameras',
    price: { min: 3499, max: 3499 },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'
    ],
    description: 'Full HD dash camera with night vision and loop recording. Capture clear footage day and night.',
    features: [
      '1080p Full HD recording',
      'Night vision capability',
      'Loop recording',
      'G-sensor for accident detection',
      'Easy installation'
    ],
    compatibility: ['Universal fit - All cars'],
    availability: 'in-stock',
    seller: mockAccessorySellers[2],
    location: 'Bangalore',
    views: 189,
    createdAt: '2024-01-12T09:15:00Z',
    featured: false,
    condition: 'new'
  },
  {
    id: 'acc-4',
    name: '3D Floor Mats Set',
    brand: '3M',
    category: 'floor-mats',
    price: { min: 1999, max: 2999 },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'
    ],
    description: 'Custom-fit 3D floor mats with raised edges. Perfect protection for your car floor.',
    features: [
      'Custom 3D design',
      'Raised edges for protection',
      'Easy to clean',
      'Non-slip base',
      'Waterproof material'
    ],
    compatibility: ['Honda City', 'Honda Amaze', 'Maruti Dzire', 'Hyundai Verna'],
    availability: 'in-stock',
    seller: mockAccessorySellers[1],
    location: 'Mumbai',
    views: 156,
    createdAt: '2024-01-15T16:20:00Z',
    featured: false,
    condition: 'new'
  },
  {
    id: 'acc-5',
    name: 'Wireless Phone Charger & Holder',
    brand: 'Portronics',
    category: 'mobile-holders',
    price: { min: 1499, max: 1499 },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'
    ],
    description: 'Wireless charging phone holder with secure grip. Compatible with all Qi-enabled devices.',
    features: [
      'Wireless charging capability',
      'Secure grip mechanism',
      'Universal compatibility',
      'Dashboard or vent mount',
      'LED charging indicator'
    ],
    compatibility: ['Universal fit - All cars'],
    availability: 'in-stock',
    seller: mockAccessorySellers[2],
    location: 'Bangalore',
    views: 298,
    createdAt: '2024-01-14T11:45:00Z',
    featured: false,
    condition: 'new'
  },
  {
    id: 'acc-6',
    name: 'LED Headlight Bulbs H4',
    brand: 'Philips',
    category: 'led-lights',
    price: { min: 2299, max: 2299 },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'
    ],
    description: 'Bright LED headlight bulbs with 6000K white light. Easy plug-and-play installation.',
    features: [
      '6000K bright white light',
      'Long lasting - 25,000 hours',
      'Easy installation',
      'Energy efficient',
      'Better visibility'
    ],
    compatibility: ['Maruti Swift', 'Maruti Alto', 'Hyundai i10', 'Tata Tiago'],
    availability: 'in-stock',
    seller: mockAccessorySellers[0],
    location: 'Delhi',
    views: 423,
    createdAt: '2024-01-09T13:30:00Z',
    featured: true,
    condition: 'new'
  }
];

export const accessoryCategories = [
  { id: 'all', name: 'All Categories', icon: '🛍️' },
  { id: 'alloy-wheels', name: 'Alloy Wheels & Tyres', icon: '⚙️' },
  { id: 'seat-covers', name: 'Seat Covers & Mats', icon: '🪑' },
  { id: 'infotainment', name: 'Infotainment & Audio', icon: '📻' },
  { id: 'led-lights', name: 'Lights & Styling', icon: '💡' },
  { id: 'dash-cameras', name: 'Electronics', icon: '📹' },
  { id: 'car-perfumes', name: 'Car Care Products', icon: '🌸' }
];
