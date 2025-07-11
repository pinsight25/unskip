
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CarMake {
  id: string;
  name: string;
  logo_url?: string;
  sort_order: number;
}

export const useCarMakes = () => {
  const [makes, setMakes] = useState<CarMake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('car_makes')
          .select('id, name, logo_url, sort_order')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setMakes(data || []);
      } catch (err) {
        console.error('Error fetching car makes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch car makes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMakes();
  }, []);

  return { makes, isLoading, error };
};
