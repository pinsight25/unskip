
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
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
    fieldErrors,
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
            fieldErrors={fieldErrors}
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
      formData.brandsDealWith && formData.brandsDealWith.length > 0 &&
      formData.about && formData.about.trim().length > 0
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
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-8 lg:pb-32 responsive-header-spacing">
      {/* Back Button and Clear Form */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dealers')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dealers
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearDealerForm}
          className="flex items-center gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Clear Form
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold">Become a Dealer</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {currentStep} of {totalSteps}</Badge>
            <Badge variant="default" className="text-xs">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Content */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
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
  );
};

export default DealerRegister;
