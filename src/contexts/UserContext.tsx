
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

    // Add timeout to prevent infinite loading - 5 second fallback
    authTimeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth check timeout - setting loading to false');
        setIsLoading(false);
      }
    }, 5000);

    // Function to sync user data from the users table
    const syncUserFromDatabase = async (userId: string) => {
      try {
        console.log('Syncing user data for ID:', userId);
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (userData && mounted) {
          console.log('User data synced from database:', userData);
          setUser({
            name: userData.name,
            phone: userData.phone,
            email: userData.email || '',
            city: userData.city || undefined,
            gender: userData.gender || undefined,
            avatar: userData.avatar || undefined
          });
        }
      } catch (error) {
        console.error('Error syncing user from database:', error);
      }
    };

    // Set up auth state change listener FIRST
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
          await syncUserFromDatabase(session.user.id);
          setIsLoading(false); // FIXED: Set loading to false after successful sign in
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing data...');
          setUser(null);
          setIsLoading(false); // FIXED: Set loading to false after sign out
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed, maintaining session...');
          // User data should already be set, but ensure we maintain it
          if (!user) {
            await syncUserFromDatabase(session.user.id);
          }
          setIsLoading(false); // FIXED: Set loading to false after token refresh
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('Initial session found, syncing data...');
            await syncUserFromDatabase(session.user.id);
          } else {
            console.log('Initial session check - no session found');
          }
          setIsLoading(false); // FIXED: Always set loading to false after initial session check
        } else {
          // FIXED: Handle any other auth events by setting loading to false
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false); // FIXED: Set loading to false on error
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Found existing session:', session.user.id);
          setSession(session);
          await syncUserFromDatabase(session.user.id);
          setIsLoading(false); // FIXED: Set loading to false after successful sync
        } else {
          console.log('No existing session found');
          if (mounted) {
            setIsLoading(false); // FIXED: Set loading to false when no session
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false); // FIXED: Set loading to false on catch
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
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setUser(null);
        setSession(null);
        console.log('User signed out successfully');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  const value = {
    user,
    isSignedIn: !!session, // Simplified check - only session matters
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
