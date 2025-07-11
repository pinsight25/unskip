
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { CarListing, AccessoryListing, UserStats } from '@/types/userListings';
import { transformCarsData, transformAccessoriesData } from '@/utils/userListingsTransformers';

// Type definition for the RPC function return value
type UserListingStats = {
  total_cars: number;
  active_cars: number;
  total_accessories: number;
  active_accessories: number;
  total_views: number;
};

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
    console.log('useUserListings: fetchUserListings called');
    console.log('useUserListings: user object:', user);
    console.log('useUserListings: user phone:', user?.phone);

    if (!user?.phone) {
      console.log('useUserListings: No user phone, setting loading to false');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('useUserListings: Starting fetch process');

      // First, get the user ID from the users table using phone
      console.log('useUserListings: Fetching user ID for phone:', user.phone);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', user.phone)
        .single();

      console.log('useUserListings: User data response:', userData);
      console.log('useUserListings: User error:', userError);

      if (userError || !userData) {
        console.error('useUserListings: Error fetching user:', userError);
        setError('Failed to fetch user data');
        return;
      }

      const userId = userData.id;
      console.log('useUserListings: Fetching listings for user:', userId);

      // Fetch user's cars
      console.log('useUserListings: Fetching cars for seller_id:', userId);
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      console.log('useUserListings: Cars data:', carsData);
      console.log('useUserListings: Cars error:', carsError);

      if (carsError) {
        console.error('useUserListings: Error fetching cars:', carsError);
        setError('Failed to fetch car listings');
        return;
      }

      // Fetch user's accessories
      console.log('useUserListings: Fetching accessories for seller_id:', userId);
      const { data: accessoriesData, error: accessoriesError } = await supabase
        .from('accessories')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      console.log('useUserListings: Accessories data:', accessoriesData);
      console.log('useUserListings: Accessories error:', accessoriesError);

      if (accessoriesError) {
        console.error('useUserListings: Error fetching accessories:', accessoriesError);
        setError('Failed to fetch accessory listings');
        return;
      }

      // Fetch user stats using RPC call with explicit typing
      console.log('useUserListings: Fetching stats for user_uuid:', userId);
      const statsResponse = await (supabase as any)
        .rpc('get_user_listing_stats', { user_uuid: userId });
      
      const { data: statsData, error: statsError } = statsResponse as {
        data: UserListingStats[] | null;
        error: any;
      };

      console.log('useUserListings: Stats data:', statsData);
      console.log('useUserListings: Stats error:', statsError);

      if (statsError) {
        console.error('useUserListings: Error fetching stats:', statsError);
      }

      // Transform data using utility functions
      console.log('useUserListings: Transforming cars data');
      const transformedCars = transformCarsData(carsData);
      console.log('useUserListings: Transformed cars:', transformedCars);

      console.log('useUserListings: Transforming accessories data');
      const transformedAccessories = transformAccessoriesData(accessoriesData);
      console.log('useUserListings: Transformed accessories:', transformedAccessories);

      setCarListings(transformedCars);
      setAccessoryListings(transformedAccessories);

      // Set stats with proper type handling
      if (statsData && Array.isArray(statsData) && statsData.length > 0) {
        const userStats = statsData[0];
        console.log('useUserListings: Setting stats:', userStats);
        setStats({
          totalCars: userStats.total_cars || 0,
          activeCars: userStats.active_cars || 0,
          totalAccessories: userStats.total_accessories || 0,
          activeAccessories: userStats.active_accessories || 0,
          totalViews: Number(userStats.total_views) || 0,
        });
      } else {
        console.log('useUserListings: No stats data found, using defaults');
      }

      console.log('useUserListings: Fetch completed successfully');
    } catch (err) {
      console.error('useUserListings: Error in fetchUserListings:', err);
      setError('Failed to fetch listings');
    } finally {
      console.log('useUserListings: Setting loading to false');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useUserListings: useEffect triggered, user phone:', user?.phone);
    fetchUserListings();
  }, [user?.phone]);

  console.log('useUserListings: Returning values:', {
    carListingsCount: carListings.length,
    accessoryListingsCount: accessoryListings.length,
    stats,
    isLoading,
    error
  });

  return {
    carListings,
    accessoryListings,
    stats,
    isLoading,
    error,
    refetch: fetchUserListings
  };
};
