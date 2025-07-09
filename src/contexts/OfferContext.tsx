
import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfferContextType {
  offeredCars: Record<string, boolean>;
  makeOffer: (carId: string) => void;
  hasOffered: (carId: string) => boolean;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const OfferProvider = ({ children }: { children: React.ReactNode }) => {
  const [offeredCars, setOfferedCars] = useState<Record<string, boolean>>({});

  // Load from session storage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('offeredCars');
    if (stored) {
      try {
        setOfferedCars(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse offered cars from session storage:', error);
      }
    }
  }, []);

  // Save to session storage whenever offeredCars changes
  useEffect(() => {
    sessionStorage.setItem('offeredCars', JSON.stringify(offeredCars));
  }, [offeredCars]);

  const makeOffer = (carId: string) => {
    setOfferedCars(prev => ({ ...prev, [carId]: true }));
  };

  const hasOffered = (carId: string) => {
    return Boolean(offeredCars[carId]);
  };

  return (
    <OfferContext.Provider value={{ offeredCars, makeOffer, hasOffered }}>
      {children}
    </OfferContext.Provider>
  );
};

export const useOfferContext = () => {
  const context = useContext(OfferContext);
  if (context === undefined) {
    throw new Error('useOfferContext must be used within an OfferProvider');
  }
  return context;
};
