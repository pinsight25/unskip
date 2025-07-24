import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Dealer } from '@/types/dealer';

export const useDealers = (locationFilter?: string, brandFilter?: string) => {
  const query = useQuery<Dealer[]>({
    queryKey: ['dealers'],
    queryFn: async () => {
      console.log('🔍 useDealers: Starting dealer query...');
      
      // First, get all dealers
      console.log('🔍 useDealers: Fetching dealers from database...');
      const { data: dealers, error: dealersError } = await supabase
        .from('dealers')
        .select('*')
        .order('verification_status', { ascending: true })
        .order('created_at', { ascending: false });
      
      console.log('🔍 useDealers: Dealers query result:', { dealers, dealersError });
      
      if (dealersError) {
        console.error('❌ useDealers: Dealers query error:', dealersError);
        throw dealersError;
      }
      if (!dealers) {
        console.log('⚠️ useDealers: No dealers found');
        return [];
      }

      console.log(`✅ useDealers: Found ${dealers.length} dealers`);

      // Get car counts for each dealer
      console.log('🔍 useDealers: Fetching car counts...');
      const { data: carCounts, error: carCountsError } = await supabase
        .from('cars')
        .select('seller_id')
        .eq('status', 'active');

      console.log('🔍 useDealers: Car counts result:', { carCounts, carCountsError });
      
      if (carCountsError) {
        console.error('❌ useDealers: Car counts error:', carCountsError);
      }

      // Get accessory counts for each dealer
      console.log('🔍 useDealers: Fetching accessory counts...');
      const { data: accessoryCounts, error: accessoryCountsError } = await supabase
        .from('accessories')
        .select('seller_id')
        .eq('status', 'active');

      console.log('🔍 useDealers: Accessory counts result:', { accessoryCounts, accessoryCountsError });
      
      if (accessoryCountsError) {
        console.error('❌ useDealers: Accessory counts error:', accessoryCountsError);
      }

      // Create maps for quick lookup
      const carCountMap = new Map();
      if (carCounts) {
        carCounts.forEach((item: any) => {
          const currentCount = carCountMap.get(item.seller_id) || 0;
          carCountMap.set(item.seller_id, currentCount + 1);
        });
      }

      const accessoryCountMap = new Map();
      if (accessoryCounts) {
        accessoryCounts.forEach((item: any) => {
          const currentCount = accessoryCountMap.get(item.seller_id) || 0;
          accessoryCountMap.set(item.seller_id, currentCount + 1);
        });
      }

      console.log('🔍 useDealers: Car count map:', Object.fromEntries(carCountMap));
      console.log('🔍 useDealers: Accessory count map:', Object.fromEntries(accessoryCountMap));

      const result = dealers.map((dealer: any) => ({
        id: dealer.id,
        name: dealer.business_name || dealer.name,
        contactPerson: dealer.contact_person || '',
        phone: dealer.phone || '',
        email: dealer.email || '',
        businessCategory: dealer.business_category || '',
        specialization: dealer.specialization || 'All Brands',
        location: dealer.shop_address || dealer.location || '',
        city: dealer.city || '',
        establishmentYear: dealer.establishment_year ? dealer.establishment_year.toString() : '',
        carsInStock: carCountMap.get(dealer.user_id) || 0,
        accessoriesInStock: accessoryCountMap.get(dealer.user_id) || 0,
        verified: dealer.verification_status === 'verified' || dealer.verified === true,
        brands: dealer.brands_deal_with || dealer.brands || [],
        shopPhoto: dealer.shop_photo || '',
        verification_status: dealer.verification_status,
        slug: dealer.slug || '',
      }));

      console.log('✅ useDealers: Final result:', result);
      return result;
    },
    staleTime: 0, // Force refetch for debugging
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Real-time subscription for dealers
  useEffect(() => {
    console.log('🔍 useDealers: Setting up real-time subscription...');
    const channel = supabase.channel('realtime-dealers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dealers',
        },
        () => {
          console.log('🔍 useDealers: Real-time update received, refetching...');
          query.refetch();
        }
      )
      .subscribe();
    return () => {
      console.log('🔍 useDealers: Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [query]);

  // Filtering
  const filteredDealers = useMemo(() => {
    console.log('🔍 useDealers: Filtering dealers...', { 
      data: query.data?.length, 
      locationFilter, 
      brandFilter 
    });
    
    if (!query.data) return [];
    
    const filtered = query.data.filter(dealer => {
      const locationMatch = !locationFilter || locationFilter === 'All Locations' ||
        dealer.location.toLowerCase() === locationFilter.toLowerCase();
      const brandMatch = !brandFilter || brandFilter === 'All Brands' ||
        dealer.brands.some((brand: string) => brand.toLowerCase() === brandFilter.toLowerCase());
      return locationMatch && brandMatch;
    });
    
    console.log(`✅ useDealers: Filtered to ${filtered.length} dealers`);
    return filtered;
  }, [query.data, locationFilter, brandFilter]);

  console.log('🔍 useDealers: Hook state:', {
    isLoading: query.isLoading,
    error: query.error,
    dataLength: query.data?.length,
    filteredLength: filteredDealers.length
  });

  return { ...query, filteredDealers };
}; 