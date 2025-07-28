
import SellCarHeader from '@/components/sell-car/SellCarHeader';
import SellCarNavigation from '@/components/sell-car/SellCarNavigation';
import SellCarStepRenderer from '@/components/sell-car/SellCarStepRenderer';
import { useSellCarLogic } from '@/hooks/useSellCarLogic';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  


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
  const handlePost = async () => {
    if (!user) {
      handleShowSignInModal();
      setPendingPost(true);
      return;
    }
    
    // Check if dealer needs to complete registration
    if (user.userType === 'dealer' && !user.dealer_registration_completed) {
      // Show benefits instead of forcing redirect
      toast({
        title: 'Unlock Dealer Benefits',
        description: 'Complete your dealer registration to unlock unlimited listings and business tools.',
        variant: 'default',
      });
      // Allow posting but with limited access
      // The limits logic will handle the restriction
    }
    
    if (user.isVerified) {
      // User is signed in and verified, skip phone verification
      setIsLoading(true);
      await handleSubmit();
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Your car has been posted successfully!',
      });
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
        dealerRegistrationCompleted={user?.dealer_registration_completed ?? false}
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
        isLoading={isLoading}
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
