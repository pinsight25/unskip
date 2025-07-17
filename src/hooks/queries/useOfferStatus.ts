import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useOfferStatus = (carId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['offer', carId, userId],
    queryFn: async () => {
      if (!carId || !userId) return null;
      const { data, error } = await supabase
        .from('offers')
        .select('id, status, amount')
        .eq('car_id', carId)
        .eq('buyer_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!carId && !!userId,
    staleTime: 30000, // Cache for 30 seconds
    retry: false, // Add this line to stop retrying 406 errors
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });
}; 