import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qrzueqtkvjamvuljgaix.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenVlcXRrdmphbXZ1bGpnYWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTAxMjIsImV4cCI6MjA2NzY2NjEyMn0.gWpRWlN5kbvJaTN0wtGj7VD9N_JWHz1Dzs9WkMkAmM8'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-qrzueqtkvjamvuljgaix-auth-token',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
})

// Test connection function with enhanced logging
export const testSupabaseConnection = async () => {
  try {
    
    // Check current auth state
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    // Test with a simple query to users table which we know exists
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist, which is fine
      return false
    }
    return true
  } catch (error) {
    return false
  }
}