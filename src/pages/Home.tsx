
import { useHomeState } from '@/hooks/useHomeState';
import { useHomeSearch } from '@/hooks/useHomeSearch';
import HomeHeader from '@/components/home/HomeHeader';
import HomeResults from '@/components/home/HomeResults';
import HomeModals from '@/components/home/HomeModals';
import SearchResultsView from '@/components/home/SearchResultsView';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';

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
    offerStatuses,
    handleFilterChange,
    handleTypeFilter,
    handleSort,
    handleSaveCar,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit,
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

  const { toast } = useToast();
  const { navigateToChat } = useChatManager();

  const handleChatClick = (car: any) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (status === 'accepted') {
      navigateToChat(car.id);
    }
  };

  const handleTestDriveClick = (car: any) => {
    toast({
      title: "Test Drive Request",
      description: `Test drive request sent for ${car.title}`,
    });
  };

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

      <div>
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

      <HomeModals
        selectedCar={selectedCar}
        showOfferModal={showOfferModal}
        showOTPModal={showOTPModal}
        isMobile={isMobile}
        onCloseOfferModal={() => setShowOfferModal(false)}
        onCloseOTPModal={() => setShowOTPModal(false)}
        onOTPSuccess={handleOTPSuccess}
        onOfferSubmit={handleOfferSubmit}
      />
    </div>
  );
};

export default Home;
