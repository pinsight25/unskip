import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city?: string;
  gender?: string;
  avatar?: string;
}

interface UserContextType {
  user: UserProfile | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (phone: string, profileData?: { name: string; email: string; city: string; gender?: string }) => void;
  signOut: () => void;
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

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authTimeoutId: NodeJS.Timeout;
    let initTimeoutId: NodeJS.Timeout;

    // Critical timeout - force loading to false after 10 seconds no matter what
    initTimeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('🚨 CRITICAL TIMEOUT: Auth initialization exceeded 10 seconds, forcing loading to false');
        setIsLoading(false);
      }
    }, 10000);

    // Function to sync user data from the users table
    const syncUserFromDatabase = async (userId: string) => {
      console.log('🔵 SYNC START for user:', userId);
      
      try {
        console.log('🔵 Querying users table...');
        
        // Add a promise timeout to prevent hanging queries
        const queryPromise = supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle(); // Use maybeSingle to handle no results gracefully

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database query timeout')), 5000);
        });

        const { data: userData, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

        console.log('🔵 User query completed:', { 
          userData, 
          error,
          errorCode: error?.code,
          errorMessage: error?.message
        });

        if (error) {
          console.error('🔵 USER QUERY ERROR:', error);
          // NEW: Create fallback user from session if query fails
          const fallbackUser = await createFallbackUserFromSession(userId);
          if (fallbackUser && mounted) {
            console.log('🔵 SETTING FALLBACK USER:', fallbackUser);
            setUser(fallbackUser);
          }
        } else if (userData && mounted) {
          console.log('🔵 SETTING USER from database:', userData);
          setUser({
            name: userData.name,
            phone: userData.phone,
            email: userData.email || '',
            city: userData.city || undefined,
            gender: userData.gender || undefined,
            avatar: userData.avatar || undefined
          });
        } else if (!userData && mounted) {
          console.log('🔵 No user data found, creating fallback');
          const fallbackUser = await createFallbackUserFromSession(userId);
          if (fallbackUser) {
            setUser(fallbackUser);
          }
        }
      } catch (err) {
        console.error('🔵 SYNC ERROR:', err);
        // NEW: Create fallback user from session data
        if (mounted) {
          const fallbackUser = await createFallbackUserFromSession(userId);
          if (fallbackUser) {
            console.log('🔵 SETTING FALLBACK USER due to sync error:', fallbackUser);
            setUser(fallbackUser);
          }
        }
      } finally {
        console.log('🔵 SETTING LOADING TO FALSE');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // NEW: Create fallback user from session data
    const createFallbackUserFromSession = async (userId: string) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('🔵 Creating fallback user from session:', session.user);
          return {
            name: session.user.user_metadata?.name || 'User',
            phone: session.user.phone || 'Unknown',
            email: session.user.email || '',
            city: undefined,
            gender: undefined,
            avatar: undefined
          };
        }
      } catch (err) {
        console.error('🔵 Error creating fallback user:', err);
      }
      return null;
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session exists:', !!session, 'User ID:', session?.user?.id);
        
        if (!mounted) return;
        
        // Clear timeouts since we got an auth event
        if (authTimeoutId) clearTimeout(authTimeoutId);
        if (initTimeoutId) clearTimeout(initTimeoutId);
        
        // Update session state
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, syncing data...');
          await syncUserFromDatabase(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing data...');
          setUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed, maintaining session...');
          if (!user) {
            await syncUserFromDatabase(session.user.id);
          } else {
            setIsLoading(false);
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('Initial session found, syncing data...');
            await syncUserFromDatabase(session.user.id);
          } else {
            console.log('Initial session check - no session found');
            setIsLoading(false);
          }
        } else {
          console.log('Other auth event, setting loading to false');
          setIsLoading(false);
        }
      }
    );

    // Check for existing session with timeout
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session...');
        
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session check timeout')), 3000);
        });

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Found existing session:', session.user.id);
          setSession(session);
          await syncUserFromDatabase(session.user.id);
        } else {
          console.log('No existing session found');
          if (mounted) setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      if (authTimeoutId) clearTimeout(authTimeoutId);
      if (initTimeoutId) clearTimeout(initTimeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = (phone: string, profileData?: { name: string; email: string; city: string; gender?: string }) => {
    const newUser: UserProfile = {
      name: profileData?.name || 'John Doe',
      phone: phone,
      email: profileData?.email || 'john.doe@example.com',
      city: profileData?.city,
      gender: profileData?.gender
    };
    setUser(newUser);
    console.log('User signed in via context:', newUser);
  };

  const signOut = async () => {
    try {
      console.log('🔵 SIGN OUT: Starting sign out process...');
      
      // Clear user state immediately for responsive UI
      setUser(null);
      setSession(null);
      console.log('🔵 SIGN OUT: Cleared local state');
      
      // Call Supabase signOut with timeout
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timeout')), 3000);
      });

      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('🔵 SIGN OUT: Successfully signed out from Supabase');
    } catch (error) {
      console.error('🔵 SIGN OUT ERROR:', error);
      // Even if signOut fails, we've already cleared local state
    }
  };

  const value = {
    user,
    isSignedIn: !!session,
    isLoading,
    signIn,
    signOut
  };

  console.log('UserContext state:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isSignedIn: !!session, 
    isLoading 
  });

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
