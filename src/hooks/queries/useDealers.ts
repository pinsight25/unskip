import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Dealer } from '@/types/dealer';

export const useDealers = (locationFilter?: string, brandFilter?: string) => {
  const query = useQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      const { data: dealers, error } = await supabase
        .from('dealers')
        .select(`
          id, user_id, business_name, contact_person, phone, email, 
          business_category, specialization, brands_deal_with, shop_address, 
          pincode, establishment_year, about, verification_status, verified, slug
        `)
        .order('business_name');

      if (error) throw error;

      // Get car counts for each dealer
      const carCountMap = new Map();
      const accessoryCountMap = new Map();

      for (const dealer of dealers || []) {
        // Get car count
        const { count: carCount } = await supabase
          .from('cars')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', dealer.user_id)
          .eq('status', 'active');

        // Get accessory count
        const { count: accessoryCount } = await supabase
          .from('accessories')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', dealer.user_id)
          .eq('status', 'active');

        carCountMap.set(dealer.user_id, carCount || 0);
        accessoryCountMap.set(dealer.user_id, accessoryCount || 0);
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
    // Use global config - no local overrides
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