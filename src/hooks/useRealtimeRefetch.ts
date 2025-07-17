import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Subscribes to Supabase real-time changes for a table and invalidates the given React Query key.
 * @param table - The table name to subscribe to (e.g., 'cars', 'dealers')
 * @param queryKey - The React Query key(s) to invalidate on change
 */
export function useRealtimeRefetch(table: string, queryKey: string | string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        // Always pass the object form for invalidateQueries
        const key = Array.isArray(queryKey) ? queryKey : [queryKey];
        queryClient.invalidateQueries({ queryKey: key });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKey, queryClient]);
} 