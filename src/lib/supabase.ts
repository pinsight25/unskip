

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const supabaseUrl = 'https://qrzueqtkvjamvuljgaix.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenVlcXRrdmphbXZ1bGpnYWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTAxMjIsImV4cCI6MjA2NzY2NjEyMn0.gWpRWlN5kbvJaTN0wtGj7VD9N_JWHz1Dzs9WkMkAmM8'

console.log('🔧 Initializing Supabase client with config:');
console.log('- URL:', supabaseUrl);
console.log('- Storage key:', 'sb-qrzueqtkvjamvuljgaix-auth-token');
console.log('- Using localStorage for session persistence');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-qrzueqtkvjamvuljgaix-auth-token',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
})

// Test connection function with enhanced logging
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Check current auth state
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('- Current session:', sessionData);
    console.log('- Session error:', sessionError);
    
    // Test with a simple query to users table which we know exists
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist, which is fine
      console.error('❌ Supabase connection error:', error)
      return false
    }
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}
