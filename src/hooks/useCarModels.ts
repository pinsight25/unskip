
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CarModel {
  id: string;
  name: string;
  make_id: string;
  sort_order: number;
}

export const useCarModels = (makeId?: string) => {
  const [models, setModels] = useState<CarModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!makeId) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('car_models')
          .select('id, name, make_id, sort_order')
          .eq('make_id', makeId)
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setModels(data || []);
      } catch (err) {
        console.error('Error fetching car models:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch car models');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [makeId]);

  return { models, isLoading, error };
};
