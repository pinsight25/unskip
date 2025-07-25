
import { supabase } from '@/lib/supabase';

export const useUserRecord = () => {
  const createOrGetUserRecord = async (authUser: any, phone: string) => {
    try {
      
      // First try to get existing user
      const { data: existingUserData, error: fetchError } = await supabase
        .from('users')
        .select('id, name, phone, email, city, gender, avatar, user_type, is_verified, dealer_registration_completed')
        .eq('id', authUser.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Don't throw - we'll create a basic record instead
      }

      if (existingUserData) {
        return { isExisting: true, userData: existingUserData };
      }

      // Create basic user record if it doesn't exist
      const basicUserData = {
        id: authUser.id,
        phone: phone,
        name: authUser.user_metadata?.name || 'User', // Use metadata if available
        email: authUser.email || null,
        city: null,
        gender: null,
        user_type: null, // Explicitly set to null for new users
        is_verified: true, // Set is_verified true on creation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newUserData, error: insertError } = await supabase
        .from('users')
        .insert(basicUserData)
        .select()
        .single();

      if (insertError) {
        // Return basic info even if DB insert fails
        return { 
          isExisting: false, 
          userData: { 
            name: 'User', 
            phone: phone, 
            email: authUser.email || '' 
          } 
        };
      }

      return { isExisting: false, userData: newUserData };

    } catch (err) {
      // Return basic fallback
      return { 
        isExisting: false, 
        userData: { 
          name: 'User', 
          phone: phone, 
          email: authUser.email || '' 
        } 
      };
    }
  };

  return {
    createOrGetUserRecord
  };
};
