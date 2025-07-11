
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://qrzueqtkvjamvuljgaix.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenVlcXRrdmphbXZ1bGpnYWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTAxMjIsImV4cCI6MjA2NzY2NjEyMn0.gWpRWlN5kbvJaTN0wtGj7VD9N_JWHz1Dzs9WkMkAmM8'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'carsx-auth',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce'
  },
})

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    // Test with a simple query to users table which we know exists
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist, which is fine
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}
