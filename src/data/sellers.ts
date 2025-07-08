
import { Seller } from '@/types/car';

export const sellers: Seller[] = [
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
