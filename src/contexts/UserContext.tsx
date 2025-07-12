
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
    let initTimeoutId: NodeJS.Timeout;
    
    console.log('🚨 USERCONTEXT: Starting auth initialization');

    // Critical timeout - force loading to false after 5 seconds
    initTimeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('🚨 CRITICAL TIMEOUT: Auth initialization exceeded 5 seconds, forcing loading to false');
        setIsLoading(false);
      }
    }, 5000);

    // Function to sync user data from the users table
    const syncUserFromDatabase = async (userId: string) => {
      console.log('🔵 SYNC START for user:', userId);
      
      try {
        console.log('🔵 Querying users table...');
        
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        console.log('🔵 User query completed:', { 
          userData, 
          error,
          errorCode: error?.code,
          errorMessage: error?.message
        });

        if (error) {
          console.error('🔵 USER QUERY ERROR:', error);
          // Set user to null if database query fails - don't create fake users
          if (mounted) {
            console.log('🔵 DATABASE ERROR - Setting user to null');
            setUser(null);
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
          console.log('🔵 No user data found in database - setting to null');
          setUser(null);
        }
      } catch (err) {
        console.error('🔵 SYNC ERROR:', err);
        if (mounted) {
          console.log('🔵 SYNC EXCEPTION - Setting user to null');
          setUser(null);
        }
      } finally {
        console.log('🔵 SETTING LOADING TO FALSE');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    console.log('🚨 SETTING UP AUTH LISTENER');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🚨 AUTH STATE CHANGE:', {
          event: event,
          time: new Date().toISOString(),
          hasSession: !!session,
          hasUser: !!user,
          isSignedIn: !!session,
          userId: session?.user?.id,
          userPhone: session?.user?.phone
        });
        
        if (!mounted) {
          console.log('🚨 AUTH CHANGE IGNORED - Component unmounted');
          return;
        }
        
        // Clear timeout since we got an auth event
        if (initTimeoutId) {
          console.log('🚨 CLEARING INIT TIMEOUT');
          clearTimeout(initTimeoutId);
        }
        
        // Update session state immediately
        console.log('🚨 UPDATING SESSION STATE:', !!session);
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🚨 USER SIGNED IN - Starting database sync');
          await syncUserFromDatabase(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚨 USER SIGNED OUT - Clearing data');
          setUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🚨 TOKEN REFRESHED - Checking user state');
          if (!user) {
            console.log('🚨 TOKEN REFRESHED - No user, syncing from database');
            await syncUserFromDatabase(session.user.id);
          } else {
            console.log('🚨 TOKEN REFRESHED - User exists, keeping current state');
            setIsLoading(false);
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            console.log('🚨 INITIAL SESSION - User found, syncing from database');
            await syncUserFromDatabase(session.user.id);
          } else {
            console.log('🚨 INITIAL SESSION - No user found');
            setIsLoading(false);
          }
        } else {
          console.log('🚨 OTHER AUTH EVENT - Setting loading to false');
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        console.log('🚨 CHECKING FOR EXISTING SESSION');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🚨 ERROR GETTING SESSION:', error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('🚨 FOUND EXISTING SESSION:', session.user.id);
          setSession(session);
          await syncUserFromDatabase(session.user.id);
        } else {
          console.log('🚨 NO EXISTING SESSION FOUND');
          if (mounted) setIsLoading(false);
        }
      } catch (error) {
        console.error('🚨 ERROR IN INITIAL SESSION CHECK:', error);
        if (mounted) setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('🚨 CLEANING UP AUTH LISTENER');
      mounted = false;
      if (initTimeoutId) {
        console.log('🚨 CLEARING TIMEOUT ON CLEANUP');
        clearTimeout(initTimeoutId);
      }
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - this should only run once

  const signIn = (phone: string, profileData?: { name: string; email: string; city: string; gender?: string }) => {
    console.log('🚨 MANUAL SIGN IN via context:', { phone, profileData });
    const newUser: UserProfile = {
      name: profileData?.name || 'User',
      phone: phone,
      email: profileData?.email || '',
      city: profileData?.city,
      gender: profileData?.gender
    };
    setUser(newUser);
  };

  const signOut = async () => {
    try {
      console.log('🚨 SIGN OUT: Starting sign out process...');
      
      // Clear user state immediately for responsive UI
      setUser(null);
      setSession(null);
      console.log('🚨 SIGN OUT: Cleared local state');
      
      // Call Supabase signOut
      await supabase.auth.signOut();
      console.log('🚨 SIGN OUT: Successfully signed out from Supabase');
    } catch (error) {
      console.error('🚨 SIGN OUT ERROR:', error);
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

  console.log('🚨 USERCONTEXT RENDER:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isSignedIn: !!session, 
    isLoading,
    userName: user?.name
  });

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
