
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

    // Function to sync user data from the users table - WITH ENHANCED DEBUG LOGGING
    const syncUserFromDatabase = async (userId: string) => {
      console.log('🔴 SYNC START:', userId);
      
      // Set a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log('🔴 SYNC TIMEOUT - Using fallback user');
        const fallbackUser = {
          name: 'Fallback User',
          phone: '8879120413',
          email: 'fallback@example.com',
          city: undefined,
          gender: undefined,
          avatar: undefined
        };
        setUser(fallbackUser);
        setIsLoading(false);
      }, 3000); // 3 second timeout

      try {
        // First, let's check if Supabase is connected
        console.log('🔴 Checking Supabase connection...');
        console.log('🔴 Supabase URL:', supabase.supabaseUrl);
        console.log('🔴 Supabase Key exists:', !!supabase.supabaseKey);
        
        // Test basic connectivity
        console.log('🔴 Testing basic query...');
        const { data: testData, error: testError, status, statusText } = await supabase
          .from('users')
          .select('count')
          .limit(1);
          
        console.log('🔴 Basic query result:', { 
          testData, 
          testError, 
          status, 
          statusText,
          errorCode: testError?.code,
          errorMessage: testError?.message,
          errorDetails: testError?.details
        });

        // Now try the actual user query
        console.log('🔴 Attempting user-specific query...');
        
        const { data: userData, error, status: userStatus } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        clearTimeout(timeoutId); // Clear timeout if query succeeds

        console.log('🔴 User query completed:', { 
          userData, 
          error,
          userStatus,
          errorCode: error?.code,
          errorMessage: error?.message,
          errorDetails: error?.details
        });

        if (error) {
          console.error('🔴 USER QUERY ERROR:', error);
          
          // Create a fallback user if query fails
          const emergencyUser = {
            name: 'Emergency User',
            phone: '8879120413',
            email: 'emergency@example.com',
            city: undefined,
            gender: undefined,
            avatar: undefined
          };
          
          console.log('🔴 USING EMERGENCY USER:', emergencyUser);
          setUser(emergencyUser);
        } else if (userData && mounted) {
          console.log('🔴 SETTING USER:', userData);
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
        console.error('🔴 SYNC ERROR:', err);
        console.error('🔴 Error type:', typeof err);
        console.error('🔴 Error details:', {
          name: err instanceof Error ? err.name : 'Unknown',
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined
        });
        
        clearTimeout(timeoutId);
        
        // Even if everything crashes, create a fallback user
        const crashUser = {
          name: 'Crash Fallback User',
          phone: '8879120413',
          email: 'crash@example.com',
          city: undefined,
          gender: undefined,
          avatar: undefined
        };
        
        console.log('🔴 CRASH FALLBACK USER:', crashUser);
        setUser(crashUser);
      } finally {
        // ALWAYS set loading to false!
        console.log('🔴 SETTING LOADING TO FALSE');
        setIsLoading(false);
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
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing data...');
          setUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed, maintaining session...');
          // User data should already be set, but ensure we maintain it
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

    // THEN check for existing session
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
          await syncUserFromDatabase(session.user.id);
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
      console.log('🔴 SIGN OUT: Starting sign out process...');
      
      // Clear user state immediately for responsive UI
      setUser(null);
      setSession(null);
      console.log('🔴 SIGN OUT: Cleared local state');
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔴 SIGN OUT ERROR:', error);
        // Even if signOut fails, we've already cleared local state
      } else {
        console.log('🔴 SIGN OUT: Successfully signed out from Supabase');
      }
    } catch (error) {
      console.error('🔴 SIGN OUT UNEXPECTED ERROR:', error);
      // Even if there's an error, we've cleared the local state
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
