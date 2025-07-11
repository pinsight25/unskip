
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseContextType {
  supabase: typeof supabase;
  isConnected: boolean;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        
        // Test connection by trying to select from a table
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setIsConnected(false);
        } else {
          console.log('✅ Supabase connection successful!');
          setIsConnected(true);
        }
      } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  const value = {
    supabase,
    isConnected,
    isLoading
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
