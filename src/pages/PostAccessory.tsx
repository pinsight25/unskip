
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
import { usePostAccessoryForm } from '@/hooks/usePostAccessoryForm';
import PostAccessoryHeader from '@/components/accessory/post/PostAccessoryHeader';
import PostAccessoryStepRenderer from '@/components/accessory/post/PostAccessoryStepRenderer';
import PostAccessoryNavigation from '@/components/accessory/post/PostAccessoryNavigation';

const PostAccessory = () => {
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
    handleSubmit,
  } = usePostAccessoryForm();

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6">
          <PostAccessoryHeader
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
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
          />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default PostAccessory;
