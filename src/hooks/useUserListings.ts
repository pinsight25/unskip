
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [isRefetching, setIsRefetching] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchUserListings = async (isManual = false) => {
    try {
      setIsLoading(true);
      setShowSkeleton(!hasFetchedOnce);
      setError(null);
      console.log('[useUserListings] Fetching listings for user:', user?.id);
      if (!user?.id) {
        console.error('[useUserListings] No user ID available');
        setError('Please sign in to view listings');
        setIsLoading(false);
        setIsRefetching(false);
        setHasFetchedOnce(true);
        return;
      }
      // Simple query for cars
      const { data: cars, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      console.log('[useUserListings] Fetched cars:', cars);
      console.log('[useUserListings] Fetch error:', carsError);
      if (carsError) {
        console.error('[useUserListings] Error details:', carsError);
        setError('Failed to fetch car listings');
        setIsLoading(false);
        setIsRefetching(false);
        setHasFetchedOnce(true);
        return;
      }
      // Fetch seller name for each car (should be the current user, but for consistency)
      let sellerName = '';
      if (user?.id) {
        const { data: sellerData } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();
        sellerName = sellerData?.name || 'Individual Seller';
      }
      // Fetch cover image for each car
      const carsWithImages = await Promise.all((cars || []).map(async (car) => {
        try {
          const { data: image, error: imageError } = await supabase
            .from('car_images')
            .select('image_url')
            .eq('car_id', car.id)
            .eq('is_cover', true)
            .maybeSingle();
          if (imageError) {
            console.warn('[useUserListings] No cover image for car', car.id, imageError);
          }
          return {
            ...car,
            coverImageUrl: image?.image_url || null,
            seller: {
              id: car.seller_id || '',
              name: sellerName,
              type: 'individual',
              phone: '',
              email: '',
              verified: car.verified || false,
              rating: 0,
              totalSales: 0,
              memberSince: car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A',
              avatar: '',
              businessName: '',
              location: [car.area, car.city].filter(Boolean).join(', '),
            },
          };
        } catch (imgErr) {
          console.error('[useUserListings] Error fetching cover image for car', car.id, imgErr);
          return {
            ...car,
            coverImageUrl: null,
            seller: {
              id: car.seller_id || '',
              name: sellerName,
              type: 'individual',
              phone: '',
              email: '',
              verified: car.verified || false,
              rating: 0,
              totalSales: 0,
              memberSince: car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A',
              avatar: '',
              businessName: '',
              location: [car.area, car.city].filter(Boolean).join(', '),
            },
          };
        }
      }));
      console.log('[useUserListings] Cars with images and seller:', carsWithImages);
      // Fetch user's accessories (unchanged)
      const { data: accessoriesData, error: accessoriesError } = await supabase
        .from('accessories')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (accessoriesError) {
        setError('Failed to fetch accessory listings');
        setIsLoading(false);
        setIsRefetching(false);
        setHasFetchedOnce(true);
        return;
      }
      // Stats
      const totalCars = carsWithImages.length;
      const activeCars = carsWithImages.filter((c) => c.status === 'active').length;
      const totalAccessories = accessoriesData?.length || 0;
      const activeAccessories = accessoriesData?.filter((a) => a.status === 'active').length || 0;
      const totalViews = (carsWithImages.reduce((sum, c) => sum + (c.views || 0), 0) || 0) +
        (accessoriesData?.reduce((sum, a) => sum + (a.views || 0), 0) || 0);
      setCarListings(carsWithImages);
      setAccessoryListings(accessoriesData ? transformAccessoriesData(accessoriesData) : []);
      setStats({
        totalCars,
        activeCars,
        totalAccessories,
        activeAccessories,
        totalViews
      });
      setHasFetchedOnce(true);
      console.log('[useUserListings] Listings/stats set. hasFetchedOnce set to true. isLoading:', isLoading, 'isRefetching:', isRefetching, 'error:', error);
    } catch (error) {
      console.error('[useUserListings] Failed to fetch listings:', error);
      setError('Failed to fetch car listings');
      setHasFetchedOnce(true);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
      setHasFetchedOnce(true);
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserListings();
    } else {
      setIsLoading(false);
      setError('Please sign in to view listings');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Refetch on window focus
  useEffect(() => {
    const handleFocus = () => fetchUserListings(true);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id]);

  return {
    carListings,
    accessoryListings,
    stats,
    isLoading,
    showSkeleton,
    isRefetching,
    error,
    refetch: () => fetchUserListings(true)
  };
};
