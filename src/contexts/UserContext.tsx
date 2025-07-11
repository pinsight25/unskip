
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

  // Debug: Check localStorage on mount
  useEffect(() => {
    console.log('LocalStorage auth items:', {
      'sb-qrzueqtkvjamvuljgaix-auth-token': localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token')
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    let authTimeoutId: NodeJS.Timeout;

    // Add timeout to prevent infinite loading - 10 second fallback
    authTimeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth check timeout - setting loading to false');
        setIsLoading(false);
      }
    }, 10000);

    // Function to sync user data from the users table
    const syncUserFromDatabase = async (userId: string) => {
      console.log('🔵 SYNC START for user:', userId);
      
      try {
        console.log('🔵 Querying users table...');
        
        const { data: userData, error, status } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        console.log('🔵 User query completed:', { 
          userData, 
          error,
          status,
          errorCode: error?.code,
          errorMessage: error?.message
        });

        if (error) {
          console.error('🔵 USER QUERY ERROR:', error);
          // Don't create fallback users anymore since RLS should work
          throw error;
        } 
        
        if (userData && mounted) {
          console.log('🔵 SETTING USER from database:', userData);
          setUser({
            name: userData.name,
            phone: userData.phone,
            email: userData.email || '',
            city: userData.city || undefined,
            gender: userData.gender || undefined,
            avatar: userData.avatar || undefined
          });
        }
      } catch (err) {
        console.error('🔵 SYNC ERROR:', err);
        // Re-throw the error instead of creating fallback users
        throw err;
      } finally {
        console.log('🔵 SETTING LOADING TO FALSE');
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'Session exists:', !!session, 'User ID:', session?.user?.id);
        
        if (!mounted) return;
        
        // Clear timeout since we got an auth event
        if (authTimeoutId) {
          clearTimeout(authTimeoutId);
        }
        
        // Update session state
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, syncing data...');
          try {
            await syncUserFromDatabase(session.user.id);
          } catch (error) {
            console.error('Failed to sync user data:', error);
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing data...');
          setUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed, maintaining session...');
          if (!user) {
            try {
              await syncUserFromDatabase(session.user.id);
            } catch (error) {
              console.error('Failed to sync user data on token refresh:', error);
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('Initial session found, syncing data...');
            try {
              await syncUserFromDatabase(session.user.id);
            } catch (error) {
              console.error('Failed to sync user data on initial session:', error);
              setIsLoading(false);
            }
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

    // Check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Found existing session:', session.user.id);
          setSession(session);
          try {
            await syncUserFromDatabase(session.user.id);
          } catch (error) {
            console.error('Failed to sync user data from existing session:', error);
            setIsLoading(false);
          }
        } else {
          console.log('No existing session found');
          if (mounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      if (authTimeoutId) {
        clearTimeout(authTimeoutId);
      }
      subscription.unsubscribe();
    };
  }, []); // Remove user dependency to prevent infinite loops

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
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔵 SIGN OUT ERROR:', error);
        // Even if signOut fails, we've already cleared local state
      } else {
        console.log('🔵 SIGN OUT: Successfully signed out from Supabase');
      }
    } catch (error) {
      console.error('🔵 SIGN OUT UNEXPECTED ERROR:', error);
      // Even if there's an error, we've cleared the local state
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
