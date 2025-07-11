
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrzueqtkvjamvuljgaix.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenVlcXRrdmphbXZ1bGpnYWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTAxMjIsImV4cCI6MjA2NzY2NjEyMn0.gWpRWlN5kbvJaTN0wtGj7VD9N_JWHz1Dzs9WkMkAmM8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'carsx-auth',
    autoRefreshToken: true,
  },
})

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1)
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
