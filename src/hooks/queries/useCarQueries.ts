import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Car } from '@/types/car';
import { formatPhoneForAuth } from '@/utils/phoneUtils';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { UseQueryResult } from '@tanstack/react-query';

// Helper to map raw DB car to Car type
function mapDbCarToCar(car: any, dealerData: any = {}, userData: any = {}) : Car {
  const isDealer = userData && userData.user_type === 'dealer';
  return {
    id: car.id,
    title: `${car.year} ${car.make} ${car.model}`,
    brand: car.make,
    model: car.model,
    variant: car.variant,
    year: car.year,
    price: car.price,
    images: Array.isArray(car.car_images) && car.car_images.length > 0
      ? car.car_images.map((img: any) => img.image_url)
      : [],
    mileage: car.kilometers_driven || 0,
    kilometersDriven: car.kilometers_driven || 0,
    fuelType: car.fuel_type,
    transmission: car.transmission,
    ownership: car.number_of_owners || 1,
    ownershipNumber: car.number_of_owners || 1,
    location: [car.area, car.city].filter(Boolean).join(', '),
    description: car.description || '',
    seller: {
      id: car.seller_id || '',
      name: isDealer ? (dealerData?.business_name || userData?.name || 'Dealer') : (userData?.name || 'Individual Seller'),
      type: userData?.user_type || 'individual',
      phone: userData?.phone || '',
      email: userData?.email || '',
      verified: userData?.is_verified || false,
      dealerVerified: isDealer ? (dealerData?.verification_status === 'verified') : undefined,
      rating: 0,
      totalSales: 0,
      memberSince: car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A',
      avatar: '',
      businessName: dealerData?.business_name || '',
      location: [car.area, car.city].filter(Boolean).join(', '),
    },
    color: car.color,
    landmark: car.landmark,
    seatingCapacity: car.seating_capacity,
    isRentAvailable: car.is_rent_available || false,
    rentPrice: car.daily_rate ? { daily: car.daily_rate, weekly: car.weekly_rate || 0 } : undefined,
    rentPolicies: undefined,
    verified: car.verified === true || false,
    featured: car.featured === true || false,
    views: car.views || 0,
    createdAt: car.created_at,
    registrationYear: car.registration_year,
    registrationState: car.registration_state,
    fitnessCertificateValidTill: car.fitness_certificate_valid_till,
    noAccidentHistory: car.no_accident_history,
    acceptOffers: car.accept_offers,
    offerPercentage: car.offer_percentage,
    insuranceValid: car.insurance_valid,
    insuranceType: car.insurance_type,
    lastServiceDate: car.last_service_date,
    serviceCenterType: car.service_center_type,
    serviceAtAuthorized: car.authorized_service_center,
    rtoTransferSupport: car.rto_transfer_support,
    insurance: undefined,
    serviceHistory: undefined,
    seller_type: userData?.user_type || 'individual',
    status: car.status,
  };
}

// Fetch all active cars for home/buy page
export const useCars = () => {
  const { toast } = useToast ? useToast() : { toast: undefined };
  const queryClient = useQueryClient();

  const query = useQuery<any[]>({
    queryKey: ['cars'],
    queryFn: async () => {
      // First, get all cars
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select(`
          id, title, price, make, model, year, seller_id, status, created_at,
          fuel_type, transmission, kilometers_driven, number_of_owners,
          area, city, color, variant, description, featured, verified, views,
          car_images(image_url, is_cover, sort_order)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (carsError) {
        throw carsError;
      }
      if (!carsData) {
        return [];
      }

      // Get unique seller IDs
      const sellerIds = [...new Set(carsData?.map(car => car.seller_id).filter(Boolean) || [])];

      // Fetch user data for all sellers
      let usersData: any[] = [];
      if (sellerIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, phone, email, user_type, is_verified')
          .in('id', sellerIds);
        
        if (usersError) {
          console.error('❌ useCars: Users query error:', usersError);
        } else {
          usersData = users || [];
        }
      }

      // Fetch dealer data for dealer users
      let dealersData: any[] = [];
      const dealerUserIds = usersData.filter(user => user.user_type === 'dealer').map(user => user.id);
      if (dealerUserIds.length > 0) {
        const { data: dealers, error: dealersError } = await supabase
          .from('dealers')
          .select('user_id, business_name, verification_status')
          .in('user_id', dealerUserIds);
        
        if (dealersError) {
          console.error('❌ useCars: Dealers query error:', dealersError);
        } else {
          dealersData = dealers || [];
        }
      }

      // Create maps for quick lookup
      const usersMap = new Map();
      usersData.forEach(user => {
        usersMap.set(user.id, user);
      });

      const dealersMap = new Map();
      dealersData.forEach(dealer => {
        dealersMap.set(dealer.user_id, dealer);
      });

      // Map cars with user and dealer data
      const carsMapped: Car[] = (carsData || []).map((car: any) => {
        const userData = usersMap.get(car.seller_id);
        const dealerData = dealersMap.get(car.seller_id);
        const mappedCar = mapDbCarToCar(car, dealerData, userData);
        
        return mappedCar;
      });
      
      return carsMapped as any[];
    },
    placeholderData: [],
    // Use global config - no local overrides
  });

  return query;
};

// Fetch user's listings for profile
export const useUserListings = (userId: string | undefined) => {
  const query = useQuery<any[]>({
    queryKey: ['userListings', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      const { data, error } = await (supabase as any)
        .from('cars')
        .select('id, title, price, make, model, year, seller_id, status, created_at, views, area, city, car_images(image_url, is_cover, sort_order)')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
    // Use global config - no local overrides
  });

  return query;
};

// Fetch all offers for offers page or user
export const useOffers = (userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<any[]>({
    queryKey: userId ? ['offers', userId] : ['offers'],
    queryFn: async () => {
      if (userId) {
        const { data, error } = await (supabase as any)
          .from('offers')
          .select('id, user_id, car_id, amount, status, created_at, updated_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data as any[];
      } else {
        const { data, error } = await (supabase as any)
          .from('offers')
          .select('id, user_id, car_id, amount, status, created_at, updated_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data as any[];
      }
    },
    // Use global config - no local overrides
  });

  return query;
};

// Fetch all chats for a user
export const useChats = (userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<any[]>({
    queryKey: userId ? ['chats', userId] : ['chats'],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await (supabase as any)
        .from('chats')
        .select('id, buyer_id, seller_id, car_id, status, created_at, updated_at')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    // Use global config - no local overrides
  });

  return query;
};

// Hook to invalidate queries after actions
export const useInvalidateCarQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateCars: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
    invalidateUserListings: () => queryClient.invalidateQueries({ queryKey: ['userListings'] }),
    invalidateDealers: () => queryClient.invalidateQueries({ queryKey: ['dealers'] }),
    invalidateOffers: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
    invalidateChats: () => queryClient.invalidateQueries({ queryKey: ['chats'] }),
    invalidateAll: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cars'] });
      await queryClient.invalidateQueries({ queryKey: ['userListings'] });
      await queryClient.invalidateQueries({ queryKey: ['dealers'] });
      await queryClient.invalidateQueries({ queryKey: ['offers'] });
      await queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    clearCarsCache: () => queryClient.removeQueries({ queryKey: ['cars'] }),
    clearAllCache: () => queryClient.clear()
  };
}; 