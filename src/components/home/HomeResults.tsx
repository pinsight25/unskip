
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSavedCars } from '@/hooks/useSavedCars';
import { useUser } from '@/contexts/UserContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Car } from '@/types/car';
import ResultsHeader from './results/ResultsHeader';
import ResultsGrid from './results/ResultsGrid';
import EmptyResults from './results/EmptyResults';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

interface HomeResultsProps {
  filteredCars: Car[];
  savedCars: string[];
  currentFilters: SearchFiltersType;
  isMobile: boolean;
  isRefreshing: boolean;
  offerStatuses: Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>;
  onSort: (sortValue: string) => void;
  onSaveCar: (carId: string) => void;
  onMakeOffer: (car: Car) => void;
  onPullToRefresh: () => void;
  onFilterChange: (filters: any) => void;
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

const HomeResults = ({
  filteredCars,
  currentFilters,
  isMobile,
  isRefreshing,
  offerStatuses,
  onSort,
  onMakeOffer,
  onPullToRefresh,
  onFilterChange,
  getOfferStatus
}: Omit<HomeResultsProps, 'savedCars' | 'onSaveCar'>) => {
  const location = useLocation();
  const { user } = useUser();
  const { openSignInModal } = useAuthModal();
  const { toast } = useToast();
  const { savedCars, saveCar, unsaveCar, isSaving } = useSavedCars();

  // Convert savedCars array to Set for O(1) lookup
  const savedCarIds = useMemo(() => new Set(savedCars), [savedCars]);

  // Limit cars to show based on mobile/desktop
  const carsToShow = useMemo(() => {
    return isMobile ? filteredCars.slice(0, 10) : filteredCars;
  }, [filteredCars, isMobile]);

  const handleSaveCar = (carId: string) => {
    if (!user) {
      openSignInModal();
      return;
    }

    if (savedCarIds.has(carId)) {
      unsaveCar(carId);
    } else {
      saveCar(carId);
    }
  };

  const handleChatClick = (car: Car) => {
    if (!user) {
      openSignInModal();
      return;
    }

    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "Please make an offer before starting a chat with the seller.",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Wait for seller response",
        description: "Please wait for the seller to respond to your offer before starting a chat.",
      });
      return;
    }
    
    if (status === 'accepted') {
      toast({
        title: "Chat Started!",
        description: `Chat started with ${car.seller.name}!`,
      });
    }
    
    if (status === 'rejected') {
      toast({
        title: "Offer was rejected",
        description: "Please make a new offer before starting a chat.",
        variant: "destructive",
      });
    }
  };

  const handleTestDriveClick = (car: Car) => {
    if (!user) {
      openSignInModal();
      return;
    }

    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "Please make an offer before scheduling a test drive.",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Wait for seller response",
        description: "Please wait for the seller to respond to your offer before scheduling a test drive.",
      });
      return;
    }
    
    if (status === 'accepted') {
      toast({
        title: "Test Drive Scheduled!",
        description: `Test drive scheduled!`,
      });
    }
    
    if (status === 'rejected') {
      toast({
        title: "Offer was rejected",
        description: "Please make a new offer before scheduling a test drive.",
        variant: "destructive",
      });
    }
  };

  const handleClearFilters = () => {
    onFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' });
  };

  return (
    <section className="pt-6 pb-8 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Desktop Results Header */}
        <ResultsHeader
          filteredCarsCount={carsToShow?.length ?? 0}
          savedCarsCount={savedCars?.length ?? 0}
          currentFilters={currentFilters}
          onSort={onSort}
          onFilterChange={onFilterChange}
        />

        {/* Mobile Results Counter with improved spacing */}
        <div className="md:hidden px-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {carsToShow?.length ?? 0} Cars
              </h2>
              {currentFilters.query && (
                <p className="text-[14px] text-gray-600 mt-1">
                  Results for "{currentFilters.query}"
                </p>
              )}
            </div>
            {savedCars?.length > 0 && (
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                <Heart className="h-4 w-4 mr-1 fill-current" />
                {savedCars?.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Results Content with proper bottom padding */}
        <div className="pb-24 md:pb-8">
          {(carsToShow?.length ?? 0) > 0 ? (
            <ResultsGrid
              cars={Array.isArray(filteredCars) ? filteredCars : []}
              savedCars={Array.isArray(savedCarIds) ? savedCarIds : []}
              isMobile={isMobile}
              onSaveCar={handleSaveCar}
              isSaving={isSaving}
              onMakeOffer={onMakeOffer}
              onChat={handleChatClick}
              onTestDrive={handleTestDriveClick}
              getOfferStatus={getOfferStatus}
            />
          ) : (
            <EmptyResults onClearFilters={handleClearFilters} />
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeResults;
