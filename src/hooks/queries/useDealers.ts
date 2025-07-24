import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Dealer } from '@/types/dealer';

export const useDealers = (locationFilter?: string, brandFilter?: string) => {
  const query = useQuery<Dealer[]>({
    queryKey: ['dealers'],
    queryFn: async () => {
      // First, get all dealers
      const { data: dealers, error: dealersError } = await supabase
        .from('dealers')
        .select('*')
        .order('verification_status', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (dealersError) {
        throw dealersError;
      }
      if (!dealers) {
        return [];
      }

      // Get car counts for each dealer
      const { data: carCounts, error: carCountsError } = await supabase
        .from('cars')
        .select('seller_id')
        .eq('status', 'active');
      
      if (carCountsError) {
        console.error('Car counts error:', carCountsError);
      }

      // Get accessory counts for each dealer
      const { data: accessoryCounts, error: accessoryCountsError } = await supabase
        .from('accessories')
        .select('seller_id')
        .eq('status', 'active');
      
      if (accessoryCountsError) {
        console.error('Accessory counts error:', accessoryCountsError);
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

      return result;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Filtering
  const filteredDealers = useMemo(() => {
    if (!query.data) return [];
    
    const filtered = query.data.filter(dealer => {
      const locationMatch = !locationFilter || locationFilter === 'All Locations' ||
        dealer.location.toLowerCase() === locationFilter.toLowerCase();
      const brandMatch = !brandFilter || brandFilter === 'All Brands' ||
        dealer.brands.some((brand: string) => brand.toLowerCase() === brandFilter.toLowerCase());
      return locationMatch && brandMatch;
    });
    
    return filtered;
  }, [query.data, locationFilter, brandFilter]);

  return { ...query, filteredDealers };
}; 