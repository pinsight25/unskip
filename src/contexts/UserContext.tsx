
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  phone: string;
  email: string;
  city?: string;
  gender?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isSignedIn: boolean;
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
  const [user, setUser] = useState<User | null>(null);

  const signIn = (phone: string, profileData?: { name: string; email: string; city: string; gender?: string }) => {
    const newUser: User = {
      name: profileData?.name || 'John Doe',
      phone: phone,
      email: profileData?.email || 'john.doe@example.com',
      city: profileData?.city,
      gender: profileData?.gender
    };
    setUser(newUser);
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
