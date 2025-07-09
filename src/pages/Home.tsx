import { useHomeState } from '@/hooks/useHomeState';
import { useHomeSearch } from '@/hooks/useHomeSearch';
import HomeHeader from '@/components/home/HomeHeader';
import HomeResults from '@/components/home/HomeResults';
import HomeModals from '@/components/home/HomeModals';
import SearchResultsView from '@/components/home/SearchResultsView';
import TestDriveModal from '@/components/modals/TestDriveModal';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import { useOfferContext } from '@/contexts/OfferContext';
import { useState } from 'react';
import { Car } from '@/types/car';

const Home = () => {
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveSelectedCar, setTestDriveSelectedCar] = useState<Car | null>(null);

  const { makeOffer } = useOfferContext();

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

  const { toast } = useToast();
  const { navigateToChat } = useChatManager();

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    if (selectedCar) {
      makeOffer(selectedCar.id);
    }
    originalHandleOfferSubmit(offer);
  };

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
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer first to schedule a test drive.",
        variant: "destructive",
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
      setTestDriveSelectedCar(car);
      setShowTestDriveModal(true);
    }
    
    if (status === 'rejected') {
      toast({
        title: "Offer was rejected",
        description: "Please make a new offer before scheduling a test drive.",
        variant: "destructive",
      });
    }
  };

  const handleTestDriveScheduled = (booking: any) => {
    toast({
      title: "Test Drive Scheduled!",
      description: `Test drive scheduled for ${booking.date} at ${booking.timeSlot}`,
    });
    setShowTestDriveModal(false);
    setTestDriveSelectedCar(null);
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

      {testDriveSelectedCar && (
        <TestDriveModal
          isOpen={showTestDriveModal}
          onClose={() => {
            setShowTestDriveModal(false);
            setTestDriveSelectedCar(null);
          }}
          car={testDriveSelectedCar}
          onScheduled={handleTestDriveScheduled}
        />
      )}
    </div>
  );
};

export default Home;
