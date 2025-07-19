
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card, CardContent } from '@/components/ui/card';
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
    isSubmitting,
    validateGST,
    handleInputChange,
    handleFileUpload,
    validateForm,
    nextStep,
    prevStep,
    handleSubmit,
    setFormData,
  } = useDealerRegistrationForm();

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked === true
    }));
  };

  // Add clearDealerForm function
  const clearDealerForm = () => {
    setFormData(() => ({
      businessName: '',
      contactPerson: '',
      phone: '',
      email: '',
      businessCategory: '',
      brandsDealWith: [],
      specialization: '',
      gstNumber: '',
      shopAddress: '',
      pincode: '',
      establishmentYear: '',
      about: '',
      documents: {
        gstCertificate: null,
        shopLicense: null,
        shopPhotos: [],
      },
      agreeToTerms: false,
    }));
    localStorage.removeItem('dealerRegistrationFormData');
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

  // Step-specific canProceed logic to avoid infinite re-renders
  let canProceed = false;
  if (currentStep === 1) {
    canProceed = Boolean(
      formData.businessName &&
      formData.contactPerson &&
      formData.phone &&
      formData.email &&
      formData.businessCategory &&
      formData.specialization &&
      formData.brandsDealWith && formData.brandsDealWith.length > 0
    );
  } else if (currentStep === 2) {
    canProceed = Boolean(
      formData.gstNumber &&
      formData.shopAddress &&
      formData.pincode &&
      formData.establishmentYear &&
      formData.about
    );
  } else if (currentStep === 3) {
    canProceed = Boolean(
      formData.documents.gstCertificate &&
      formData.documents.shopLicense &&
      formData.documents.shopPhotos && formData.documents.shopPhotos.length > 0 &&
      formData.agreeToTerms
    );
  }

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gray-50">
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
                {/* Clear Form Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={clearDealerForm}
                    className="text-destructive border border-destructive px-3 py-1 rounded hover:bg-red-50 font-medium text-sm"
                    type="button"
                  >
                    Clear Form
                  </button>
                </div>
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
                  canProceed={canProceed}
                  isSubmitting={isSubmitting}
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
