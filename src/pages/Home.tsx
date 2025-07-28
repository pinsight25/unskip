
import { useState, useMemo } from 'react';
import { useCars } from '@/hooks/queries/useCarQueries';
import { useDealers } from '@/hooks/queries/useDealers';

import HomeHeader from '@/components/home/HomeHeader';
import HeroBanner from '@/components/home/HeroBanner';
import SearchBar from '@/components/home/SearchBar';
import SearchFilters from '@/components/home/SearchFilters';
import SearchResultsView from '@/components/home/SearchResultsView';
import HomeResults from '@/components/home/HomeResults';
import HomeModals from '@/components/home/HomeModals';
import HomeModalsContainer from '@/components/home/containers/HomeModalsContainer';
import { useHomeOfferHandlers } from '@/components/home/handlers/HomeOfferHandlers';
import { useHomeTestDriveHandlers } from '@/components/home/handlers/HomeTestDriveHandlers';
import { useHomeChatHandlers } from '@/components/home/handlers/HomeChatHandlers';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  // Use only useCars for car data
  const { data: cars = [], refetch: refetchCars } = useCars();
  const { data: dealers = [], refetch: refetchDealers } = useDealers();
  const allCarsCount = cars.length;
  // Count cars where seller_type === 'dealer'
  const dealerCarsCount = cars.filter(car => car.seller_type === 'dealer').length;
  const ownerCarsCount = cars.filter(car => car.seller_type === 'individual').length;

  // UI state for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'dealer' | 'individual'>('all');
  // Add all required filter state
  const [priceRange] = useState<[number, number]>([0, 5000000]);
  const [location] = useState('');

  // Filtering logic (replicate from useHomeState)
  const filteredCars = useMemo(() => {
    let filtered = cars;
    if (selectedType !== 'all') {
      filtered = filtered.filter(car => car.seller_type === selectedType);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(car =>
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query) ||
        car.seller.name.toLowerCase().includes(query)
      );
    }
    // Add more filters (price, city, etc.) as needed
    return filtered;
  }, [cars, selectedType, searchQuery]);

  // Handler for type filter
  const handleTypeFilter = (type: 'all' | 'dealer' | 'individual') => setSelectedType(type);
  // Handler for search
  const handleSearch = (query: string) => setSearchQuery(query);

  // Handlers for offers, chat, test drive, etc. (unchanged)
  const { handleOfferSubmit } = useHomeOfferHandlers({ selectedCar: null, originalHandleOfferSubmit: () => {} });
  const { handleChatClick } = useHomeChatHandlers({ getOfferStatus: () => 'none' });
  const { testDriveSelectedCar, handleTestDriveClick, handleTestDriveScheduled, setTestDriveSelectedCar } = useHomeTestDriveHandlers({ getOfferStatus: () => 'none' });
  const { openSignInModal } = useAuthModal();

  // Provide a stub getOfferStatus function
  const getOfferStatus = (carId: string) => 'none' as const;

  return (
    <div className="bg-gray-50 relative">
      <HomeHeader
        currentFilters={{ type: selectedType, query: searchQuery, priceRange, location }}
        onFilterChange={() => {}}
        onTypeChange={handleTypeFilter}
        isSearching={false}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClearSearch={() => setSearchQuery('')}
        resultCount={filteredCars.length}
        allCarsCount={allCarsCount}
        dealersCount={dealerCarsCount}
        ownerCarsCount={ownerCarsCount}
      />
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Results */}
        <HomeResults
          filteredCars={filteredCars}
          currentFilters={{ type: selectedType, query: searchQuery, priceRange, location }}
          isMobile={false}
          isRefreshing={false}
          offerStatuses={{}}
          onSort={() => {}}
          onMakeOffer={() => {}}
          onPullToRefresh={() => {}}
          onFilterChange={() => {}}
          getOfferStatus={getOfferStatus}
        />
      </div>
      <HomeModalsContainer
        selectedCar={null}
        showOfferModal={false}
        isMobile={false}
        onCloseOfferModal={() => {}}
        onOfferSubmit={handleOfferSubmit}
        openSignInModal={openSignInModal}
        testDriveSelectedCar={null}
        showTestDriveModal={false}
        onCloseTestDriveModal={() => {}}
        onTestDriveScheduled={() => {}}
      />
    </div>
  );
};

export default Home;
