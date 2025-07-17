import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Car } from '@/types/car';
import { formatPhoneForAuth } from '@/utils/phoneUtils';
import { useEffect } from 'react';

// Helper to map raw DB car to Car type
function mapDbCarToCar(car: any, dealersMap: Record<string, any> = {}) : Car {
  const isDealer = car.users?.user_type === 'dealer';
  const dealerInfo = isDealer ? dealersMap[car.seller_id] : undefined;
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
      name: car.users?.name || 'Individual Seller',
      type: isDealer ? 'dealer' : 'individual',
      phone: formatPhoneForAuth(car.phone_number || ''),
      email: car.email || '',
      verified: car.verified || false,
      dealerVerified: isDealer ? (dealerInfo?.verified === true) : undefined,
      rating: 0,
      totalSales: 0,
      memberSince: car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A',
      avatar: '',
      businessName: '',
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
    seller_type: car.users?.user_type || 'individual',
  };
}

// Fetch all active cars for home/buy page
export const useCars = () => {
  const query = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      console.log('[React Query] Fetching cars...');
      
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select(`
          *,
          car_images!inner (image_url, is_cover, sort_order),
          users:seller_id (id, name, is_verified, user_type, phone)
        `)
        .eq('status', 'active')
        .eq('car_images.is_cover', true)
        .order('created_at', { ascending: false });
      if (carsError) {
        console.error('[React Query] Error fetching cars:', carsError);
        throw carsError;
      }
      // Remove dealer lookup to avoid 406 error
      const carsMapped: Car[] = (carsData || []).map((car: any) => mapDbCarToCar(car, {}));
      console.log('[React Query] Fetched cars:', carsMapped.length);
      return carsMapped;
    },
  });

  // Supabase real-time subscription for cars
  useEffect(() => {
    const channel = supabase.channel('realtime-cars')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cars',
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};

// Fetch user's listings for profile
export const useUserListings = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['userListings', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');
      console.log('[React Query] Fetching user listings for:', userId);
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          car_images (*)
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Supabase real-time subscription for user's listings
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
        () => {
          query.refetch();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, query]);

  return query;
};

// Hook to invalidate queries after actions
export const useInvalidateCarQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: async () => {
      console.log('[React Query] Invalidating all car queries...');
      await queryClient.invalidateQueries({ queryKey: ['cars'] });
      await queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  };
}; 