import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Dealer } from '@/types/dealer';

export const useDealers = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      const { data: dealers, error } = await supabase
        .from('dealers')
        .select(`
          id, user_id, slug, business_name, contact_person, business_category,
          brands_deal_with, specialization, shop_address, pincode, establishment_year,
          verification_status, total_sales, member_since, created_at, updated_at,
          shop_photos_urls
        `)
        .in('verification_status', ['pending', 'verified']) // Show pending and verified dealers
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useDealers: Query error:', error);
        throw error;
      }
      
      if (!dealers || dealers.length === 0) {

        return [];
      }

      
              dealers.forEach(dealer => {
          // Dealer data processed silently
        });

      const dealerUserIds = dealers.map(dealer => dealer.user_id);

      const { data: carCounts, error: carError } = await supabase
        .from('cars')
        .select('seller_id')
        .in('seller_id', dealerUserIds)
        .eq('status', 'active');

      if (carError) {
        console.error('❌ useDealers: Car counts error:', carError);
      }

      const { data: accessoryCounts, error: accessoryError } = await supabase
        .from('accessories')
        .select('seller_id')
        .in('seller_id', dealerUserIds)
        .eq('status', 'active');

      if (accessoryError) {
        console.error('❌ useDealers: Accessory counts error:', accessoryError);
      }

      const carCountMap: Record<string, number> = {};
      const accessoryCountMap: Record<string, number> = {};

      carCounts?.forEach(car => {
        carCountMap[car.seller_id] = (carCountMap[car.seller_id] || 0) + 1;
      });

      accessoryCounts?.forEach(accessory => {
        accessoryCountMap[accessory.seller_id] = (accessoryCountMap[accessory.seller_id] || 0) + 1;
      });

      const result = dealers.map(dealer => {
        const carsInStock = carCountMap[dealer.user_id] || 0;
        const accessoriesInStock = accessoryCountMap[dealer.user_id] || 0;
        
        return {
          ...dealer,
          carsInStock,
          accessoriesInStock,
        };
      });
      
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchOnMount: false, // Don't refetch on mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
  });
}; 