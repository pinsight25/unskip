
import { useState, useMemo } from 'react';
import { useCars } from '@/hooks/queries/useCarQueries';
import HomeHeader from '@/components/home/HomeHeader';
import { useDealers } from '@/hooks/queries/useDealers';
import HomeResults from '@/components/home/HomeResults';
import SearchResultsView from '@/components/home/SearchResultsView';
import HomeModalsContainer from '@/components/home/containers/HomeModalsContainer';
import { useHomeOfferHandlers } from '@/components/home/handlers/HomeOfferHandlers';
import { useHomeChatHandlers } from '@/components/home/handlers/HomeChatHandlers';
import { useHomeTestDriveHandlers } from '@/components/home/handlers/HomeTestDriveHandlers';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Skeleton } from '@/components/ui/skeleton';
// Remove ErrorState and ConnectionStatusIndicator imports

const Home = () => {
  // Use only useCars for car data
  const { data: cars = [], isLoading, isFetching } = useCars();
  const { data: dealers = [] } = useDealers();
  const allCarsCount = cars.length;
  // Count cars where seller.type === 'dealer'
  const dealerCarsCount = cars.filter(car => car.seller.type === 'dealer').length;
  const ownerCarsCount = cars.filter(car => car.seller.type === 'individual').length;

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
      filtered = filtered.filter(car => car.seller.type === selectedType);
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
  // ... add other filter handlers as needed

  // Handlers for offers, chat, test drive, etc. (unchanged)
  const { handleOfferSubmit } = useHomeOfferHandlers({ selectedCar: null, originalHandleOfferSubmit: () => {} });
  const { handleChatClick } = useHomeChatHandlers({ getOfferStatus: () => 'none' });
  const { testDriveSelectedCar, handleTestDriveClick, handleTestDriveScheduled, setTestDriveSelectedCar } = useHomeTestDriveHandlers({ getOfferStatus: () => 'none' });
  const { openSignInModal } = useAuthModal();

  // Provide a stub getOfferStatus function
  const getOfferStatus = (carId: string) => 'none' as const;

  // Show skeleton loader only if there is no cached data (first visit)
  if (isLoading && (!cars || cars.length === 0)) {
    return (
      <div className="relative min-h-[400px]">
        <div className="flex flex-wrap gap-6 justify-center opacity-60">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-[320px] h-[340px] mb-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 relative">
      {/* Show cached data banner if not loading and data is from cache */}
      {/* Placeholder: You can add logic to detect cached data if needed */}
      {/* <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-medium">Showing cached results</div> */}
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
        <HomeResults
          filteredCars={filteredCars}
          currentFilters={{ type: selectedType, query: searchQuery, priceRange, location }}
          isMobile={false}
          isRefreshing={isFetching}
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
