import { Tables } from '@/integrations/supabase/types'

export type Accessory = Tables<'accessories'> & {
  seller?: {
    id: string
    full_name: string
    phone: string
    dealerVerified: boolean
    seller_type: string
  }
}

export interface AccessorySeller {
  id: string;
  name: string;
  shopName: string;
  type: 'dealer' | 'individual';
  phone: string;
  email: string;
  verified: boolean;
  totalSales: number;
  memberSince: string;
  avatar?: string;
  location: string;
  gstNumber?: string;
  specialization: AccessoryCategory[];
  brandsCarried: string[];
  responseTime: string;
}

export type AccessoryCategory = 
  | 'alloy-wheels'
  | 'seat-covers'
  | 'floor-mats'
  | 'mobile-holders'
  | 'dash-cameras'
  | 'led-lights'
  | 'car-perfumes'
  | 'steering-covers'
  | 'infotainment'
  | 'parking-sensors';

export interface AccessoryFilters {
  search: string;
  category: AccessoryCategory | 'all';
  priceRange: [number, number];
  carModel: string;
  location: string;
  sellerType: 'all' | 'dealer' | 'individual';
  availability: 'all' | 'in-stock' | 'order';
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest';
}
