
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { CarListing, AccessoryListing, UserStats } from '@/types/userListings';
import { transformCarsData, transformAccessoriesData } from '@/utils/userListingsTransformers';

export const useUserListings = () => {
  const { user } = useUser();
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [accessoryListings, setAccessoryListings] = useState<AccessoryListing[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCars: 0,
    activeCars: 0,
    totalAccessories: 0,
    activeAccessories: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserListings = async () => {
    if (!user?.phone) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, get the user ID from the users table using phone
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', user.phone)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user:', userError);
        setError('Failed to fetch user data');
        return;
      }

      const userId = userData.id;

      // Fetch user's cars
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (carsError) {
        console.error('Error fetching cars:', carsError);
        setError('Failed to fetch car listings');
        return;
      }

      // Fetch user's accessories
      const { data: accessoriesData, error: accessoriesError } = await supabase
        .from('accessories')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (accessoriesError) {
        console.error('Error fetching accessories:', accessoriesError);
        setError('Failed to fetch accessory listings');
        return;
      }

      // Fetch user stats using RPC call with proper typing
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_listing_stats', { user_uuid: userId });

      if (statsError) {
        console.error('Error fetching stats:', statsError);
      }

      // Transform data using utility functions
      const transformedCars = transformCarsData(carsData);
      const transformedAccessories = transformAccessoriesData(accessoriesData);

      setCarListings(transformedCars);
      setAccessoryListings(transformedAccessories);

      // Set stats with proper type handling
      if (statsData && Array.isArray(statsData) && statsData.length > 0) {
        const userStats = statsData[0];
        setStats({
          totalCars: userStats.total_cars || 0,
          activeCars: userStats.active_cars || 0,
          totalAccessories: userStats.total_accessories || 0,
          activeAccessories: userStats.active_accessories || 0,
          totalViews: Number(userStats.total_views) || 0,
        });
      }

    } catch (err) {
      console.error('Error in fetchUserListings:', err);
      setError('Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [user?.phone]);

  return {
    carListings,
    accessoryListings,
    stats,
    isLoading,
    error,
    refetch: fetchUserListings
  };
};
