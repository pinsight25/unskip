
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: (phone: string) => void;
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
  const [user, setUser] = useState<User | null>(null);

  const signIn = (phone: string) => {
    // Mock user data - in real app this would come from backend
    const mockUser: User = {
      name: 'John Doe',
      phone: phone,
      email: 'john.doe@example.com'
    };
    setUser(mockUser);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    isSignedIn: !!user,
    signIn,
    signOut
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
