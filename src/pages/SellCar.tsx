
import SellCarHeader from '@/components/sell-car/SellCarHeader';
import SellCarNavigation from '@/components/sell-car/SellCarNavigation';
import SellCarStepRenderer from '@/components/sell-car/SellCarStepRenderer';
import { useSellCarLogic } from '@/hooks/useSellCarLogic';
import { useState } from 'react';
import OTPModal from '@/components/modals/OTPModal';
import SignInModal from '@/components/modals/SignInModal';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const SellCar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
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

  // Custom submit handler
  const handlePost = () => {
    if (!user) {
      setShowSignInModal(true);
      setPendingPost(true);
      return;
    }
    if (!formData.phoneVerified) {
      setShowOTPModal(true);
      setPendingPost(true);
      return;
    }
    handleSubmit();
  };

  // After successful OTP/sign-in, post and redirect to profile
  const handleAuthSuccess = () => {
    setShowOTPModal(false);
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

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleAuthSuccess}
        phoneNumber={formData.phone || ''}
        purpose="post-listing"
      />
      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
};

export default SellCar;
