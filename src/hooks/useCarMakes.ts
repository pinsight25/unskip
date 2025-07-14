
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CarMake {
  id: string;
  name: string;
  logo_url?: string;
  sort_order: number;
}

export const useCarMakes = () => {
  const {
    data: makes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['car-makes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_makes')
        .select('id, name, logo_url, sort_order')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });
  return { makes, isLoading, error };
};
