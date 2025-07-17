import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/integrations/supabase/types';
import { formatPhoneForDB } from '@/utils/phoneUtils';

// User type based on the database schema
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  gender?: 'Male' | 'Female' | 'Other';
  avatar?: string;
  isVerified?: boolean;
  userType?: 'regular' | 'premium' | 'dealer';
  phone_verified?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (phone: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

// Function to sync user data from the users table
const syncUserFromDatabase = async (
  userId: string, 
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void,
  mounted: React.MutableRefObject<boolean>,
  authUser?: SupabaseUser
) => {
  try {
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('🔵 USER QUERY ERROR:', error);
    }

    // If no user exists, create one
    if (!userData && authUser) {
      
      const newUserData = {
        id: userId,
        phone: formatPhoneForDB(authUser.phone),
        name: userData?.name || authUser.user_metadata?.name || 'User',
        email: userData?.email || authUser.email || authUser.user_metadata?.email || null,
        city: userData?.city || null,
        user_type: userData?.user_type || 'regular',
        // Always include is_verified to prevent overwriting the correct value
        is_verified: userData?.is_verified !== undefined ? userData.is_verified : true,
        created_at: userData?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .upsert(newUserData, { onConflict: 'id' })
        .select()
        .single();

      if (createError) {
        console.error('🔵 Error creating user:', createError);
        // Even if creation fails, set basic user data
        if (mounted.current) {
          setUser({
            id: userId,
            name: newUserData.name,
            phone: newUserData.phone,
            email: newUserData.email || '',
            city: undefined,
            gender: undefined
          });
        }
      } else if (createdUser && mounted.current) {
        setUser({
          id: createdUser.id,
          name: createdUser.name,
          phone: createdUser.phone,
          email: createdUser.email || '',
          city: createdUser.city || undefined,
          gender: createdUser.gender || undefined,
          avatar: createdUser.avatar || undefined,
          isVerified: createdUser.is_verified || undefined,
          userType: createdUser.user_type || undefined
        });
      }
    } else if (userData && mounted.current) {
      // After fetching userData from the users table, set the user object and log it
      const userObj = {
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
        email: userData.email || '',
        city: userData.city || undefined,
        gender: userData.gender || undefined,
        avatar: userData.avatar || undefined,
        isVerified: userData.is_verified || undefined,
        userType: userData.user_type || undefined,
        phone_verified: 'phone_verified' in userData ? Boolean((userData as any).phone_verified) : false,
      };
      console.log('[UserContext] Setting user:', userObj);
      console.log('[UserContext] User ID:', userObj.id);
      console.log('[UserContext] User phone:', userObj.phone);
      setUser(userObj);
    } else if (mounted.current) {
      setUser(null);
    }
  } catch (err) {
    console.error('🔵 SYNC ERROR:', err);
    if (mounted.current) {
      setUser(null);
    }
  }
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = React.useRef(true);

  useEffect(() => {
    mounted.current = true;
    let timeoutId: NodeJS.Timeout | null = null;
    // Add a 3-second max timeout to force loading to false
    timeoutId = setTimeout(() => {
      if (mounted.current) setIsLoading(false);
    }, 3000);

    // Supabase real-time subscription for user profile
    let channel: any = null;
    if (user?.id) {
      channel = supabase.channel('realtime-user-profile')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${user.id}`
          },
          () => {
            // Refetch user profile data
            syncUserFromDatabase(user.id, setUser, setIsLoading, mounted);
          }
        )
        .subscribe();
    }

    return () => {
      mounted.current = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('🔵 Session error:', sessionError);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          await syncUserFromDatabase(session.user.id, setUser, setIsLoading, mounted, session.user);
        } else {
          if (mounted.current) {
            setUser(null);
            setIsLoading(false);
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            
            if (event === 'SIGNED_IN' && session?.user) {
              await syncUserFromDatabase(session.user.id, setUser, setIsLoading, mounted, session.user);
            } else if (event === 'SIGNED_OUT') {
              if (mounted.current) {
                setUser(null);
                setIsLoading(false);
              }
            }
          }
        );

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('🔵 Auth initialization error:', error);
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        }
      });
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
    // Force reload to clear any cached state
    window.location.href = '/';
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update user error:', error);
        return;
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncUserFromDatabase(session.user.id, setUser, setIsLoading, mounted, session.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Always expose isVerified as a boolean reflecting phone_verified or is_verified
  const userWithVerified = user ? {
    ...user,
    isVerified: user.phone_verified || user.isVerified || false,
  } : null;

  return (
    <UserContext.Provider value={{ user, isLoading, signIn, signOut, updateUser, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};