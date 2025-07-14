
import { useHomeState } from '@/hooks/useHomeState';
import { useHomeSearch } from '@/hooks/useHomeSearch';
import HomeHeader from '@/components/home/HomeHeader';
import HomeResults from '@/components/home/HomeResults';
import SearchResultsView from '@/components/home/SearchResultsView';
import HomeModalsContainer from '@/components/home/containers/HomeModalsContainer';
import { useHomeOfferHandlers } from '@/components/home/handlers/HomeOfferHandlers';
import { useHomeChatHandlers } from '@/components/home/handlers/HomeChatHandlers';
import { useHomeTestDriveHandlers } from '@/components/home/handlers/HomeTestDriveHandlers';

const Home = () => {
  const {
    filteredCars,
    savedCars,
    currentFilters,
    showOfferModal,
    setShowOfferModal,
    showOTPModal,
    setShowOTPModal,
    selectedCar,
    isMobile,
    isRefreshing,
    loading,
    offerStatuses,
    handleFilterChange,
    handleTypeFilter,
    handleSort,
    handleSaveCar,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit: originalHandleOfferSubmit,
    handlePullToRefresh,
    getOfferStatus,
    // Add error and refetch from useHomeState
    error,
    refetch
  } = useHomeState();

  const {
    isSearching,
    query,
    results,
    resultCount,
    performSearch,
    clearSearch
  } = useHomeSearch();

  const { handleOfferSubmit } = useHomeOfferHandlers({
    selectedCar,
    originalHandleOfferSubmit
  });

  const { handleChatClick } = useHomeChatHandlers({
    getOfferStatus
  });

  const {
    showTestDriveModal,
    testDriveSelectedCar,
    handleTestDriveClick,
    handleTestDriveScheduled,
    setShowTestDriveModal,
    setTestDriveSelectedCar
  } = useHomeTestDriveHandlers({
    getOfferStatus
  });

  // Best-practice UI for loading, error, and empty states
  if (loading && filteredCars.length === 0) {
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
        <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  if (filteredCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full text-center px-4">
        <div className="mb-6">
          {/* Use a car or search icon from your assets or Lucide */}
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-16 w-16 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-5a2 2 0 0 1 1.87-1.3h10.26A2 2 0 0 1 19 8l2 5M5 13h14m-9 4h4m-7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No cars found.</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
          <button
            onClick={() => handleFilterChange({ query: '', type: 'all', priceRange: [0, Infinity], location: '', city: '' })}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold shadow hover:from-orange-500 hover:to-red-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  // Subtle spinner overlay for background refetch
  return (
    <div className="bg-gray-50 relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
          <div className="loader spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" role="status"></div>
        </div>
      )}
      <HomeHeader
        currentFilters={currentFilters}
        onFilterChange={handleFilterChange}
        onTypeChange={handleTypeFilter}
        isSearching={isSearching}
        searchQuery={query}
        onSearch={performSearch}
        onClearSearch={clearSearch}
        resultCount={resultCount}
      />
      <div className="max-w-7xl mx-auto px-4">
        {isSearching ? (
          <SearchResultsView
            results={results}
            query={query}
            savedCars={savedCars}
            isMobile={isMobile}
            onSaveCar={handleSaveCar}
            onMakeOffer={handleMakeOffer}
            onChat={handleChatClick}
            onTestDrive={handleTestDriveClick}
            getOfferStatus={getOfferStatus}
          />
        ) : (
          <HomeResults
            filteredCars={filteredCars}
            savedCars={savedCars}
            currentFilters={currentFilters}
            isMobile={isMobile}
            isRefreshing={isRefreshing}
            offerStatuses={offerStatuses}
            onSort={handleSort}
            onSaveCar={handleSaveCar}
            onMakeOffer={handleMakeOffer}
            onPullToRefresh={handlePullToRefresh}
            onFilterChange={handleFilterChange}
            getOfferStatus={getOfferStatus}
          />
        )}
      </div>
      <HomeModalsContainer
        selectedCar={selectedCar}
        showOfferModal={showOfferModal}
        showOTPModal={showOTPModal}
        isMobile={isMobile}
        onCloseOfferModal={() => setShowOfferModal(false)}
        onCloseOTPModal={() => setShowOTPModal(false)}
        onOTPSuccess={handleOTPSuccess}
        onOfferSubmit={handleOfferSubmit}
        testDriveSelectedCar={testDriveSelectedCar}
        showTestDriveModal={showTestDriveModal}
        onCloseTestDriveModal={() => {
          setShowTestDriveModal(false);
          setTestDriveSelectedCar(null);
        }}
        onTestDriveScheduled={handleTestDriveScheduled}
      />
    </div>
  );
};

export default Home;
