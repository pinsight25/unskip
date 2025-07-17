
import { useState, useMemo } from 'react';
import { useCars } from '@/hooks/queries/useCarQueries';
import HomeHeader from '@/components/home/HomeHeader';
import HomeResults from '@/components/home/HomeResults';
import SearchResultsView from '@/components/home/SearchResultsView';
import HomeModalsContainer from '@/components/home/containers/HomeModalsContainer';
import { useHomeOfferHandlers } from '@/components/home/handlers/HomeOfferHandlers';
import { useHomeChatHandlers } from '@/components/home/handlers/HomeChatHandlers';
import { useHomeTestDriveHandlers } from '@/components/home/handlers/HomeTestDriveHandlers';
import { useAuthModal } from '@/contexts/AuthModalContext';

const Home = () => {
  // Use React Query for car data
  const { data: cars = [], isLoading, error, refetch } = useCars();

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg font-semibold text-gray-900 mb-2">Loading cars...</div>
        <div className="text-gray-600">Fetching the latest listings from our database</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-lg font-semibold text-red-600 mb-2">Failed to load cars.</div>
        <div className="text-gray-600 mb-4">{error.message || "Something went wrong."}</div>
        <div className="space-x-4">
          <button onClick={() => refetch()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

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
      />
      <div className="max-w-7xl mx-auto px-4 relative">
        <HomeResults
          filteredCars={filteredCars}
          savedCars={[]}
          currentFilters={{ type: selectedType, query: searchQuery, priceRange, location }}
          isMobile={false}
          isRefreshing={false}
          offerStatuses={{}}
          onSort={() => {}}
          onSaveCar={() => {}}
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
