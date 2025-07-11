
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name: string;
  state?: string;
  sort_order: number;
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('cities')
          .select('id, name, state, sort_order')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setCities(data || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, isLoading, error };
};
