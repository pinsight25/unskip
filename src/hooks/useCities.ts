
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface City {
  id: string;
  name: string;
  state?: string;
  sort_order: number;
}

const STATIC_CITIES = [
  { id: '1', name: 'Chennai', sort_order: 1 },
  { id: '2', name: 'Mumbai', sort_order: 2 },
  { id: '3', name: 'Delhi', sort_order: 3 },
  { id: '4', name: 'Bangalore', sort_order: 4 },
  { id: '5', name: 'Hyderabad', sort_order: 5 },
  { id: '6', name: 'Pune', sort_order: 6 },
  { id: '7', name: 'Kolkata', sort_order: 7 },
];
const CITY_CACHE_KEY = 'cities_cache_v1';
function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }
async function fetchWithRetry(fn: () => Promise<any>, retries = 3, delay = 500) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try { return await fn(); } catch (err) { lastErr = err; await sleep(delay); }
  }
  throw lastErr;
}
export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      setError(null);
      // Try cache first
      const cached = localStorage.getItem(CITY_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setCities(parsed);
          setIsLoading(false);
        } catch {}
      }
      // Try Supabase with retry
      try {
        const { data, error } = await fetchWithRetry(() =>
          (async () => await supabase.from('cities').select('id, name, state, sort_order').eq('is_active', true).order('sort_order'))(), 3, 500
        );
        if (error) throw error;
        if (data && data.length > 0) {
          setCities(data);
          localStorage.setItem(CITY_CACHE_KEY, JSON.stringify(data));
        } else {
          throw new Error('No cities found');
        }
        setError(null);
      } catch (err) {
        // Fallback to cache if available
        const cached = localStorage.getItem(CITY_CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setCities(parsed);
            setError('Loaded from cache due to network error.');
          } catch {}
        } else {
          setCities(STATIC_CITIES);
          setError('Loaded fallback cities due to network error.');
        }
      }
      setIsLoading(false);
    };
    fetchCities();
  }, []);
  return { cities, isLoading, error };
};
