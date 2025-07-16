
import { useHomeState } from '@/hooks/useHomeState';
import { useHomeSearch } from '@/hooks/useHomeSearch';
import HomeHeader from '@/components/home/HomeHeader';
import HomeResults from '@/components/home/HomeResults';
import SearchResultsView from '@/components/home/SearchResultsView';
import HomeModalsContainer from '@/components/home/containers/HomeModalsContainer';
import { useHomeOfferHandlers } from '@/components/home/handlers/HomeOfferHandlers';
import { useHomeChatHandlers } from '@/components/home/handlers/HomeChatHandlers';
import { useHomeTestDriveHandlers } from '@/components/home/handlers/HomeTestDriveHandlers';
import { useState, useEffect } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0); // Fallback refresh mechanism
  
  const {
    filteredCars,
    savedCars,
    currentFilters,
    showOfferModal,
    setShowOfferModal,
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
    testDriveSelectedCar,
    handleTestDriveClick,
    handleTestDriveScheduled,
    setTestDriveSelectedCar
  } = useHomeTestDriveHandlers({
    getOfferStatus
  });

  const { openSignInModal } = useAuthModal();

  useEffect(() => {
    console.log('Home page refetch available?', typeof refetch);
    console.log('Checking for flag:', localStorage.getItem('carsListUpdated'));
    const carsUpdated = localStorage.getItem('carsListUpdated');
    let reloadKey = '';

    if (carsUpdated) {
      try {
        const { timestamp, action, carId } = JSON.parse(carsUpdated);
        reloadKey = `hasRefreshed_home_${action}_${carId}`;
        const timeDiff = Date.now() - timestamp;

        console.log('Cars updated flag found:', { action, carId, timeDiff, reloadKey });
        console.log('Session storage check:', sessionStorage.getItem(reloadKey));

        if (timeDiff < 10000 && !sessionStorage.getItem(reloadKey)) {
          localStorage.removeItem('carsListUpdated');
          sessionStorage.setItem(reloadKey, 'true');
          if (typeof refetch === 'function') {
            console.log('Calling refetch for cars update');
            refetch();
          } else {
            console.log('Refetch function not available, using fallback refresh');
            setRefreshKey(prev => prev + 1);
          }
          setTimeout(() => {
            sessionStorage.removeItem(reloadKey);
          }, 30000);
        } else {
          console.log('Flag too old or already refreshed, removing');
          localStorage.removeItem('carsListUpdated');
        }
      } catch (e) {
        console.error('Error parsing carsListUpdated:', e);
        localStorage.removeItem('carsListUpdated');
      }
    } else {
      console.log('No carsListUpdated flag found');
    }
  }, [refetch, refreshKey]); // Add refreshKey as dependency

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
        <div className="space-x-4">
          <button onClick={() => refetch()} className="btn btn-primary">
            Retry with Refetch
          </button>
          <button onClick={() => setRefreshKey(prev => prev + 1)} className="btn btn-secondary">
            Retry with Fallback
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-outline">
            Hard Reload
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Debug: refetch type = {typeof refetch}, refreshKey = {refreshKey}
        </div>
      </div>
    );
  }

  // Remove the top-level 'if (filteredCars.length === 0)' block
  // Always render HomeHeader and the main UI
  // Only show the empty state in HomeResults or the results grid

  // Subtle spinner overlay for background refetch
  return (
    <div className="bg-gray-50 relative">
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
      <div className="max-w-7xl mx-auto px-4 relative">
        {isSearching ? (
          <div className="relative">
            {isRefreshing && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
                <div className="loader spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" role="status"></div>
              </div>
            )}
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
          </div>
        ) : (
          <div className="relative">
            {isRefreshing && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
                <div className="loader spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-primary" role="status"></div>
              </div>
            )}
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
          </div>
        )}
      </div>
      <HomeModalsContainer
        selectedCar={selectedCar}
        showOfferModal={showOfferModal}
        isMobile={isMobile}
        onCloseOfferModal={() => setShowOfferModal(false)}
        onOfferSubmit={handleOfferSubmit}
        openSignInModal={openSignInModal}
        testDriveSelectedCar={testDriveSelectedCar}
        showTestDriveModal={!!testDriveSelectedCar}
        onCloseTestDriveModal={() => setTestDriveSelectedCar(null)}
        onTestDriveScheduled={handleTestDriveScheduled}
      />
    </div>
  );
};

export default Home;
