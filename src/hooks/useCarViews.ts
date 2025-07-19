import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

export const useTrackCarView = (car: any) => {
  const { user } = useUser();

  useEffect(() => {
    const trackView = async () => {
      if (!car?.id || !car?.seller_id) return;
      // Don't track seller viewing their own car
      if (user?.id === car.seller_id) return;
      try {
        const { error } = await supabase
          .from('car_views')
          .insert({
            car_id: car.id,
            viewer_id: user?.id || null,
            seller_id: car.seller_id
          });
        // Silent fail in production
      } catch (error) {
        // Silent fail in production
      }
    };
    trackView();
  }, [car?.id, car?.seller_id, user?.id]);
};

export const useCarViewCount = (carId: string) => {
  return useQuery({
    queryKey: ['car-views', carId],
    queryFn: async () => {
      const { count } = await supabase
        .from('car_views')
        .select('*', { count: 'exact', head: true })
        .eq('car_id', carId);
      return count || 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 