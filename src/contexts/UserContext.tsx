import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { formatPhoneForDB } from '@/utils/phoneUtils';
import { useQueryClient } from '@tanstack/react-query';

// Function to create welcome notification for new users
const createWelcomeNotification = async (userId: string, userName: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'system',
        title: 'Welcome to Unskip! 🎉',
        message: `Hi ${userName}! Welcome to Unskip, your trusted marketplace for buying and selling cars. Start by exploring cars or list your own vehicle.`,
        priority: 'medium',
        is_read: false
      });

    if (error) {
      // Silent error handling
    }
  } catch (error) {
    // Silent error handling
  }
};

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
  dealer_registration_completed?: boolean;
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
      // console.error('🔵 USER QUERY ERROR:', error);
    }

    // If no user exists, create one
    if (!userData && authUser) {
      
      const newUserData = {
        id: userId,
        phone: formatPhoneForDB(authUser.phone || ''),
        name: userData?.name || authUser.user_metadata?.name || 'User',
        email: userData?.email || authUser.email || authUser.user_metadata?.email || null,
        city: userData?.city || null,
        user_type: null, // Don't set user_type for new users - let them choose
        // Always include is_verified to prevent overwriting the correct value
        is_verified: userData?.is_verified !== undefined ? userData.is_verified : true,
        dealer_registration_completed: userData?.dealer_registration_completed ?? false, // <-- Add this line
        created_at: userData?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .upsert(newUserData, { onConflict: 'id' })
        .select()
        .single();

      if (createError) {
        // console.error('🔵 Error creating user:', createError);
        // Even if creation fails, set basic user data
        if (mounted.current) {
          setUser({
            id: userId,
            name: newUserData.name,
            phone: newUserData.phone,
            email: newUserData.email || '',
          });
          setIsLoading(false); // CRITICAL: Set loading to false even if user creation fails
        }
      } else if (createdUser && mounted.current) {
        // Create welcome notification for new users
        await createWelcomeNotification(userId, newUserData.name);
        
        setUser({
          id: createdUser.id,
          name: createdUser.name,
          phone: createdUser.phone,
          email: createdUser.email || '',
          city: createdUser.city || undefined,
          gender: createdUser.gender || undefined,
          avatar: createdUser.avatar || undefined,
          isVerified: createdUser.is_verified || undefined,
          userType: createdUser.user_type || undefined,
          phone_verified: 'phone_verified' in createdUser ? Boolean((createdUser as any).phone_verified) : false,
          dealer_registration_completed: createdUser.dealer_registration_completed ?? false,
        });
        setIsLoading(false);
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
        dealer_registration_completed: userData.dealer_registration_completed ?? false, // <-- Add this line
      };
      // console.log('[UserContext] Setting user:', userObj);
      // console.log('[UserContext] User ID:', userObj.id);
      // console.log('[UserContext] User phone:', userObj.phone);
      setUser(userObj);
      setIsLoading(false); // CRITICAL: Set loading to false after user is loaded
    } else if (mounted.current) {
      setUser(null);
    }
  } catch (err) {
    // console.error('🔵 SYNC ERROR:', err);
    if (mounted.current) {
      setUser(null);
    }
  }
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);
  const initialized = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    mounted.current = true;
    
    const initializeAuth = async () => {
      // Prevent multiple initializations
      if (initialized.current) return;
      initialized.current = true;
      
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
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
        // CRITICAL: Set loading to false even on error
        if (mounted.current) {
          setIsLoading(false);
        }
        return undefined;
      }
    };

    initializeAuth();
  }, []);

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
      // console.error('Sign in error:', error);
      return { error };
    }
  };

           const signOut = async () => {
    
               // Add a flag to prevent multiple simultaneous sign-outs
           if ((window as any).__signingOut) {
             return;
           }
    
    (window as any).__signingOut = true;
    
    try {
                   // Check current session before sign out
             const { data: { session } } = await supabase.auth.getSession();
      
                   if (!session) {
               // Clear local state even if no session
               setUser(null);
               setIsLoading(false);
               queryClient.clear();
               localStorage.removeItem('sb-qrzueqtkvjamvuljgaix-auth-token');
               sessionStorage.clear();
               return;
             }
      
                   // Clear Supabase session with timeout
             const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 5000)
      );
      
      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;
      
                   if (error) {
               throw error;
             }
      
      // Clear local state
      setUser(null);
      setIsLoading(false);
      
      // Clear React Query cache completely
      queryClient.clear();
      
      // Clear any cached data from localStorage
      localStorage.removeItem('sb-qrzueqtkvjamvuljgaix-auth-token');
      localStorage.removeItem('carDeleted');
      localStorage.removeItem('carsListUpdated');
      localStorage.removeItem('carPosted');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
                   // Don't force reload - let React handle the state changes
               } catch (error) {
             // Even if there's an error, try to clear local state
             setUser(null);
             setIsLoading(false);
             queryClient.clear();
             localStorage.removeItem('sb-qrzueqtkvjamvuljgaix-auth-token');
             sessionStorage.clear();
             throw error; // Re-throw the error so calling code can handle it
           } finally {
             // Always clear the flag
             (window as any).__signingOut = false;
           }
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
        // console.error('Update user error:', error);
        return;
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      // console.error('Update user error:', error);
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
      // console.error('Refresh user error:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, signIn, signOut, updateUser, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};