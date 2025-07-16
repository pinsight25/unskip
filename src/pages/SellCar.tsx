
import SellCarHeader from '@/components/sell-car/SellCarHeader';
import SellCarNavigation from '@/components/sell-car/SellCarNavigation';
import SellCarStepRenderer from '@/components/sell-car/SellCarStepRenderer';
import { useSellCarLogic } from '@/hooks/useSellCarLogic';
import { useState } from 'react';
import SignInModal from '@/components/modals/SignInModal';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';

const SellCar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInModalKey, setSignInModalKey] = useState(0);
  const [pendingPost, setPendingPost] = useState(false);

  const {
    currentStep,
    formData,
    setFormData,
    updateFormData,
    activeCarListings,
    carLimit,
    isEditMode,
    validatePrice,
    validateKilometersDriven,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleBackToHome,
    clearFormData,
    canSubmit,
    userType
  } = useSellCarLogic();

  const handleShowSignInModal = () => {
    setSignInModalKey(prev => prev + 1);
    setShowSignInModal(true);
  };

  // Custom submit handler
  const handlePost = () => {
    if (!user) {
      handleShowSignInModal();
      setPendingPost(true);
      return;
    }
    if (user.isVerified) {
      // User is signed in and verified, skip phone verification
      handleSubmit();
      return;
    }
    // User is signed in but not verified, require phone verification
    handleShowSignInModal();
    setPendingPost(true);
  };

  // After successful OTP/sign-in, post and redirect to profile
  const handleAuthSuccess = () => {
    setShowSignInModal(false);
    setPendingPost(false);
    setFormData((prev) => ({ ...prev, phoneVerified: true }));
    handleSubmit();
    navigate('/profile');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-8 lg:pb-32 responsive-header-spacing">
      <SellCarHeader
        currentStep={currentStep}
        activeCarListings={activeCarListings}
        carLimit={carLimit}
        userType={userType as 'dealer' | 'regular'}
        onBackClick={handleBackToHome}
        onClearForm={clearFormData}
      />

      <SellCarStepRenderer
        currentStep={currentStep}
        formData={formData}
        setFormData={setFormData}
        updateFormData={updateFormData}
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
        onSubmit={handlePost}
        canSubmit={() => !!canSubmit()}
      />

      {/* Sign In Modal */}
      <SignInModal
        key={signInModalKey}
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default SellCar;
