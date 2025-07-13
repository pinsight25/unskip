
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
    getOfferStatus
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

  return (
    <div className="bg-gray-50">
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
        ) : loading ? (
          <div className="text-center py-12">
            <div className="text-lg font-semibold text-gray-900 mb-2">Loading cars...</div>
            <div className="text-gray-600">Fetching the latest listings from our database</div>
          </div>
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
