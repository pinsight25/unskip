
import { useSupabase } from '@/contexts/SupabaseContext'

export const useSupabaseConnection = () => {
  const { supabase, isConnected, isLoading } = useSupabase()

  return {
    supabase,
    isConnected,
    isLoading,
  }
}
