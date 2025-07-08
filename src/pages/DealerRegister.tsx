import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useDealerRegistrationForm } from '@/hooks/useDealerRegistrationForm';
import BusinessInformationStep from '@/components/dealer/registration/BusinessInformationStep';
import LegalLocationStep from '@/components/dealer/registration/LegalLocationStep';
import DocumentUploadStep from '@/components/dealer/registration/DocumentUploadStep';
import RegistrationNavigation from '@/components/dealer/registration/RegistrationNavigation';

const DealerRegister = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    totalSteps,
    progress,
    formData,
    validateGST,
    handleInputChange,
    handleFileUpload,
    validateStep,
    nextStep,
    prevStep,
    handleSubmit,
  } = useDealerRegistrationForm();

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    updateFormData('agreeToTerms', checked === true);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInformationStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <LegalLocationStep
            formData={formData}
            onInputChange={handleInputChange}
            validateGST={validateGST}
          />
        );
      case 3:
        return (
          <DocumentUploadStep
            formData={formData}
            onFileUpload={handleFileUpload}
            onTermsChange={handleTermsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => navigate('/dealers')}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dealers
              </button>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Become a Dealer</h1>
              <p className="text-gray-600">Join our network of trusted automotive dealers</p>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>

                {/* Step Content */}
                {renderCurrentStep()}

                {/* Navigation Buttons */}
                <RegistrationNavigation
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onPrevStep={prevStep}
                  onNextStep={nextStep}
                  onSubmit={handleSubmit}
                  canProceed={validateStep(currentStep)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DealerRegister;
