
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, testSupabaseConnection } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: SupabaseClient
  isConnected: boolean
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

interface SupabaseProviderProps {
  children: React.ReactNode
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      console.log('🔌 Testing Supabase connection...')
      const connected = await testSupabaseConnection()
      setIsConnected(connected)
      setIsLoading(false)
    }

    checkConnection()
  }, [])

  const value = {
    supabase,
    isConnected,
    isLoading
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
