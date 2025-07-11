
import { useSupabase } from '@/contexts/SupabaseContext'

export const useSupabaseConnection = () => {
  const { supabase, isConnected, isLoading } = useSupabase()

  const logConnectionStatus = () => {
    if (isLoading) {
      console.log('🔄 Supabase connection status: Loading...')
    } else if (isConnected) {
      console.log('✅ Supabase connection status: Connected')
    } else {
      console.log('❌ Supabase connection status: Disconnected')
    }
  }

  return {
    supabase,
    isConnected,
    isLoading,
    logConnectionStatus
  }
}
