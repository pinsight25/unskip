
import SellCarHeader from '@/components/sell-car/SellCarHeader';
import SellCarNavigation from '@/components/sell-car/SellCarNavigation';
import SellCarStepRenderer from '@/components/sell-car/SellCarStepRenderer';
import { useSellCarLogic } from '@/hooks/useSellCarLogic';

const SellCar = () => {
  const {
    currentStep,
    formData,
    setFormData,
    activeCarListings,
    carLimit,
    isEditMode,
    validatePrice,
    validateKilometersDriven,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleBackToHome
  } = useSellCarLogic();

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-44 lg:pb-32 responsive-header-spacing">
      <SellCarHeader
        currentStep={currentStep}
        activeCarListings={activeCarListings}
        carLimit={carLimit}
        onBackClick={handleBackToHome}
      />

      <SellCarStepRenderer
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        validatePrice={validatePrice}
        validateKilometersDriven={validateKilometersDriven}
      />

      <SellCarNavigation
        currentStep={currentStep}
        activeCarListings={activeCarListings}
        carLimit={carLimit}
        termsAccepted={formData.termsAccepted}
        isEditMode={isEditMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SellCar;
