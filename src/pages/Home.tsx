
import { useHomeState } from '@/hooks/useHomeState';
import HomeHeader from '@/components/home/HomeHeader';
import HomeResults from '@/components/home/HomeResults';
import HomeModals from '@/components/home/HomeModals';

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
    handleFilterChange,
    handleTypeFilter,
    handleSort,
    handleSaveCar,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit,
    handlePullToRefresh
  } = useHomeState();

  return (
    <div className="bg-background min-h-screen">
      <HomeHeader
        currentFilters={currentFilters}
        onFilterChange={handleFilterChange}
        onTypeChange={handleTypeFilter}
      />

      <HomeResults
        filteredCars={filteredCars}
        savedCars={savedCars}
        currentFilters={currentFilters}
        isMobile={isMobile}
        isRefreshing={isRefreshing}
        onSort={handleSort}
        onSaveCar={handleSaveCar}
        onMakeOffer={handleMakeOffer}
        onPullToRefresh={handlePullToRefresh}
        onFilterChange={handleFilterChange}
      />

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
