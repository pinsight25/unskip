import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import { usePostAccessoryForm } from '@/hooks/usePostAccessoryForm';
import PostAccessoryHeader from '@/components/accessory/post/PostAccessoryHeader';
import PostAccessoryStepRenderer from '@/components/accessory/post/PostAccessoryStepRenderer';
import PostAccessoryNavigation from '@/components/accessory/post/PostAccessoryNavigation';
import { getAccessoryLimit } from '@/constants/limits';
import { useToast } from '@/hooks/use-toast';

const PostAccessory = () => {
  const { toast } = useToast();
  const {
    currentStep,
    totalSteps,
    formData,
    updateFormData,
    validateStep,
    handleNext,
    handlePrevious,
    handleBack,
    handlePhoneVerification,
    handleSubmit: originalHandleSubmit,
  } = usePostAccessoryForm();

  // Mock active accessory listings count - will be replaced with real data from Supabase
  const activeAccessoryListings = 7; // Mock count
  const userType = 'regular'; // Mock user type - will come from user context
  const accessoryLimit = getAccessoryLimit(userType);

  const handleSubmit = () => {
    // Check accessory listing limit before submission
    if (activeAccessoryListings >= accessoryLimit) {
      toast({
        title: "Listing Limit Reached",
        description: `You've reached your free limit of ${accessoryLimit} accessory listings. Remove an old listing to post a new one.`,
        variant: "destructive"
      });
      return;
    }

    originalHandleSubmit();
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6">
          <PostAccessoryHeader
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            activeCount={activeAccessoryListings}
            limit={accessoryLimit}
          />

          {/* Form Content */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <PostAccessoryStepRenderer
                currentStep={currentStep}
                formData={formData}
                onUpdate={updateFormData}
                onPhoneVerification={handlePhoneVerification}
              />
            </CardContent>
          </Card>

          <PostAccessoryNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            canProceed={validateStep(currentStep)}
            isLimitReached={activeAccessoryListings >= accessoryLimit}
          />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default PostAccessory;
