
import { supabase } from '@/lib/supabase';

export const useUserRecord = () => {
  const createOrGetUserRecord = async (authUser: any, phone: string) => {
    try {
      console.log('🔍 Creating/getting user record for:', authUser.id);
      
      // First try to get existing user
      const { data: existingUserData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching user:', fetchError);
        // Don't throw - we'll create a basic record instead
      }

      if (existingUserData) {
        console.log('✅ User record exists:', existingUserData);
        return { isExisting: true, userData: existingUserData };
      }

      // Create basic user record if it doesn't exist
      console.log('📝 Creating basic user record...');
      const basicUserData = {
        id: authUser.id,
        phone: phone,
        name: authUser.user_metadata?.name || 'User', // Use metadata if available
        email: authUser.email || null,
        city: null,
        gender: null,
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
        console.error('❌ Error creating user record:', insertError);
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

      console.log('✅ Created basic user record:', newUserData);
      return { isExisting: false, userData: newUserData };

    } catch (err) {
      console.error('❌ Error in createOrGetUserRecord:', err);
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
