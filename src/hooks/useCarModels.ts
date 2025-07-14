
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CarModel {
  id: string;
  name: string;
  make_id: string;
  sort_order: number;
}

export const useCarModels = (makeId?: string) => {
  const {
    data: models = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['car-models', makeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select('id, name, make_id, sort_order')
        .eq('make_id', makeId)
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!makeId,
  });
  return { models, isLoading, error };
};
