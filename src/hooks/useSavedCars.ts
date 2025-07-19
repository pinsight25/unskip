import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import type { Database } from '@/lib/database.types';

export type CarRow = Database['public']['Tables']['cars']['Row'];

export function useSavedCars() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const { data: savedCars, isLoading, refetch } = useQuery<string[]>({
    queryKey: ['savedCars', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await (supabase as any)
        .from('saved_cars')
        .select('car_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Return an array of car IDs
      return (data || []).map((row: any) => row.car_id);
    },
    enabled: !!user?.id,
  });

  // Real-time subscription for saved_cars
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel(`realtime-saved-cars-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_cars',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['savedCars', user.id] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const saveCar = async (carId: string) => {
    if (!user?.id) return;
    setIsSaving(carId);
    const { error } = await (supabase as any).from('saved_cars').insert({ user_id: user.id, car_id: carId });
    setIsSaving(null);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['savedCars', user.id] });
    }
  };

  const unsaveCar = async (carId: string) => {
    if (!user?.id) return;
    setIsSaving(carId);
    const { error } = await (supabase as any).from('saved_cars').delete().eq('user_id', user.id).eq('car_id', carId);
    setIsSaving(null);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['savedCars', user.id] });
    }
  };

  return { savedCars, isLoading, saveCar, unsaveCar, isSaving, refetch };
} 