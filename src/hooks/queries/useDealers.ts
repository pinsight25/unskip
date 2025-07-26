import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Dealer } from '@/types/dealer';

export const useDealers = (locationFilter?: string, brandFilter?: string) => {
  const query = useQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      console.log('🔍 Starting dealer query...');
      
      const { data: dealers, error } = await supabase
        .from('dealers')
        .select(`
          id, user_id, business_name, contact_person, phone, email, 
          business_category, specialization, brands_deal_with, shop_address, 
          pincode, establishment_year, about, verification_status, verified, slug,
          shop_photos_urls
        `)
        .order('business_name');

      if (error) throw error;
      console.log('📋 Found dealers:', dealers?.length || 0);

      // Get all dealer user IDs
      const dealerUserIds = dealers?.map(dealer => dealer.user_id) || [];
      console.log('🆔 Dealer user IDs:', dealerUserIds);

      // Get car counts for all dealers in one query
      const { data: carCounts, error: carError } = await supabase
        .from('cars')
        .select('seller_id')
        .eq('status', 'active')
        .in('seller_id', dealerUserIds);

      if (carError) {
        console.error('❌ Car count error:', carError);
      } else {
        console.log('🚗 Car counts data:', carCounts);
      }

      // Get accessory counts for all dealers in one query
      const { data: accessoryCounts, error: accessoryError } = await supabase
        .from('accessories')
        .select('seller_id')
        .eq('status', 'active')
        .in('seller_id', dealerUserIds);

      if (accessoryError) {
        console.error('❌ Accessory count error:', accessoryError);
      } else {
        console.log('📦 Accessory counts data:', accessoryCounts);
      }

      // Create count maps
      const carCountMap = new Map();
      const accessoryCountMap = new Map();

      // Count cars per seller
      carCounts?.forEach(car => {
        const currentCount = carCountMap.get(car.seller_id) || 0;
        carCountMap.set(car.seller_id, currentCount + 1);
      });

      // Count accessories per seller
      accessoryCounts?.forEach(accessory => {
        const currentCount = accessoryCountMap.get(accessory.seller_id) || 0;
        accessoryCountMap.set(accessory.seller_id, currentCount + 1);
      });

      console.log('🗺️ Car count map:', Object.fromEntries(carCountMap));
      console.log('🗺️ Accessory count map:', Object.fromEntries(accessoryCountMap));

      const result = dealers.map((dealer: any) => {
        const carCount = carCountMap.get(dealer.user_id) || 0;
        const accessoryCount = accessoryCountMap.get(dealer.user_id) || 0;
        
        // Debug logging
        console.log(`🏢 Dealer ${dealer.business_name} (${dealer.user_id}): ${carCount} cars, ${accessoryCount} accessories`);
        
        return {
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
          carsInStock: carCount,
          accessoriesInStock: accessoryCount,
          verified: dealer.verification_status === 'verified' || dealer.verified === true,
          brands: dealer.brands_deal_with || dealer.brands || [],
          shopPhoto: dealer.shop_photo || '',
          shop_photos_urls: dealer.shop_photos_urls || [],
          verification_status: dealer.verification_status,
          slug: dealer.slug || '',
        };
      });

      console.log('✅ Final result:', result);
      return result;
    },
    // Force fresh data to avoid cache issues
    staleTime: 0,
    gcTime: 0,
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