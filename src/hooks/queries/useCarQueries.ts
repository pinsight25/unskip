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
  const lastRealtimeRefetch = useRef(0);
  const POLL_INTERVAL = 30000; // 30 seconds fallback polling
  const DEBOUNCE_MS = 1000; // 1 second debounce for real-time

  const query = useQuery<any[]>({
    queryKey: ['cars'],
    queryFn: async () => {
      console.log('🔍 useCars: Starting cars query...');
      
      // First, get all cars
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select(`
          id, title, price, make, model, year, seller_id, status, created_at,
          fuel_type, transmission, kilometers_driven, number_of_owners,
          area, city, color, variant, description, featured, verified,
          car_images(image_url, is_cover, sort_order)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      console.log('🔍 useCars: Cars query result:', { carsData: carsData?.length, carsError });
        
      if (carsError) {
        console.error('❌ useCars: Cars query error:', carsError);
        throw carsError;
      }

      // Get unique seller IDs
      const sellerIds = [...new Set(carsData?.map(car => car.seller_id).filter(Boolean) || [])];
      console.log('🔍 useCars: Seller IDs:', sellerIds);

      // Fetch user data for all sellers
      let usersData: any[] = [];
      if (sellerIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, phone, email, user_type, is_verified')
          .in('id', sellerIds);
        
        console.log('🔍 useCars: Users query result:', { users: users?.length, usersError });
        
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
        
        console.log('🔍 useCars: Dealers query result:', { dealers: dealers?.length, dealersError });
        
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
        
        console.log('🔍 useCars: Mapped car:', {
          id: mappedCar.id,
          title: mappedCar.title,
          seller: {
            name: mappedCar.seller.name,
            type: mappedCar.seller.type,
            dealerVerified: mappedCar.seller.dealerVerified,
            businessName: mappedCar.seller.businessName
          },
          seller_type: mappedCar.seller_type,
          userData: userData ? { id: userData.id, name: userData.name, user_type: userData.user_type } : null,
          dealerData: dealerData ? { user_id: dealerData.user_id, business_name: dealerData.business_name, verification_status: dealerData.verification_status } : null
        });
        
        return mappedCar;
      });
      
      console.log(`✅ useCars: Mapped ${carsMapped.length} cars`);
      return carsMapped as any[];
    },
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    placeholderData: [],
    staleTime: 0, // Force refetch for debugging
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Use React Query default retry logic
  });

  // Debounced real-time subscription
  useEffect(() => {
    const channel = supabase.channel('realtime-cars-and-images')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cars',
        },
        () => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'car_images',
        },
        () => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .subscribe();
    // Fallback polling
    const pollInterval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    }, POLL_INTERVAL * 2); // Fallback every 60s
    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [queryClient]);

  return query;
};

// Fetch user's listings for profile
export const useUserListings = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const lastRealtimeRefetch = useRef(0);
  const POLL_INTERVAL = 30000; // 30 seconds fallback polling
  const DEBOUNCE_MS = 1000; // 1 second debounce for real-time

  const query = useQuery<any[]>({
    queryKey: ['userListings', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      const { data, error } = await (supabase as any)
        .from('cars')
        .select('id, title, price, make, model, year, seller_id, status, created_at, car_images(image_url, is_cover, sort_order)')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: Infinity,
  });

  // Debounced real-time subscription for user's listings
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel(`realtime-user-listings-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cars',
          filter: `seller_id=eq.${userId}`
        },
        (payload) => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: ['userListings', userId] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
};

// Fetch all dealers for dealers page
export const useDealers = () => {
  const queryClient = useQueryClient();
  const lastRealtimeRefetch = useRef(0);
  const POLL_INTERVAL = 30000; // 30 seconds fallback polling
  const DEBOUNCE_MS = 1000; // 1 second debounce for real-time

  const query = useQuery<any[]>({
    queryKey: ['dealers'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('dealers')
        .select('id, user_id, business_name, shop_address, phone, email, brands_deal_with, shop_photos_urls, about, created_at, updated_at, verified, verification_status')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: Infinity,
  });

  // Debounced real-time subscription for dealers
  useEffect(() => {
    const channel = supabase.channel('realtime-dealers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dealers',
        },
        (payload) => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: ['dealers'] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

// Fetch all offers for offers page or user
export const useOffers = (userId?: string) => {
  const queryClient = useQueryClient();
  const lastRealtimeRefetch = useRef(0);
  const POLL_INTERVAL = 30000; // 30 seconds fallback polling
  const DEBOUNCE_MS = 1000; // 1 second debounce for real-time

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
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: Infinity,
  });

  // Debounced real-time subscription for offers
  useEffect(() => {
    const channel = supabase.channel('realtime-offers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
        },
        (payload) => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: userId ? ['offers', userId] : ['offers'] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return query;
};

// Fetch all chats for a user
export const useChats = (userId?: string) => {
  const queryClient = useQueryClient();
  const lastRealtimeRefetch = useRef(0);
  const POLL_INTERVAL = 30000; // 30 seconds fallback polling
  const DEBOUNCE_MS = 1000; // 1 second debounce for real-time

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
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: Infinity,
  });

  // Debounced real-time subscription for chats
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel('realtime-chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: ['chats', userId] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const now = Date.now();
          if (now - lastRealtimeRefetch.current > DEBOUNCE_MS) {
            queryClient.invalidateQueries({ queryKey: ['chats', userId] });
            lastRealtimeRefetch.current = now;
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return query;
};

// Hook to invalidate queries after actions
export const useInvalidateCarQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cars'] });
      await queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  };
}; 