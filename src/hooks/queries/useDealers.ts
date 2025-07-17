import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Dealer } from '@/types/dealer';

export const useDealers = (locationFilter?: string, brandFilter?: string) => {
  const query = useQuery<Dealer[]>({
    queryKey: ['dealers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .order('verification_status', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((dealer: any) => ({
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
        carsInStock: dealer.cars_in_stock || 0,
        verified: dealer.verification_status === 'verified' || dealer.verified === true,
        brands: dealer.brands_deal_with || dealer.brands || [],
        shopPhoto: dealer.shop_photo || '',
        verification_status: dealer.verification_status,
        slug: dealer.slug || '',
      }));
    },
  });

  // Real-time subscription for dealers
  useEffect(() => {
    const channel = supabase.channel('realtime-dealers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dealers',
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

  // Filtering
  const filteredDealers = useMemo(() => {
    if (!query.data) return [];
    return query.data.filter(dealer => {
      const locationMatch = !locationFilter || locationFilter === 'All Locations' ||
        dealer.location.toLowerCase() === locationFilter.toLowerCase();
      const brandMatch = !brandFilter || brandFilter === 'All Brands' ||
        dealer.brands.some((brand: string) => brand.toLowerCase() === brandFilter.toLowerCase());
      return locationMatch && brandMatch;
    });
  }, [query.data, locationFilter, brandFilter]);

  return { ...query, filteredDealers };
}; 