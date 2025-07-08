import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DealerRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessCategory: '',
    gstNumber: '',
    shopAddress: '',
    pincode: '',
    yearsInBusiness: '',
    operatingHours: '',
    documents: {
      gstCertificate: null as File | null,
      shopLicense: null as File | null,
      shopPhotos: [] as File[],
      ownerIdProof: null as File | null,
    },
    agreeToTerms: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateGST = (gst: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'shopPhotos') {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: Array.from(files),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: files[0],
        },
      }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.businessName && formData.contactPerson && formData.phone && formData.email && formData.businessCategory;
      case 2:
        return formData.gstNumber && validateGST(formData.gstNumber) && formData.shopAddress && formData.pincode && formData.yearsInBusiness;
      case 3:
        return formData.documents.gstCertificate && formData.documents.shopLicense && formData.documents.ownerIdProof && formData.agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Please fill all required fields",
        description: "Complete all fields before proceeding to the next step.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      // Here you would normally submit to backend
      console.log('Submitting dealer registration:', formData);
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 2-3 business days.",
      });
      
      // Redirect to a success page or back to dealers
      setTimeout(() => {
        navigate('/dealers');
      }, 2000);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Your dealership name"
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              placeholder="Owner/Manager name"
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="+91 98765 43210"
              maxLength={15}
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@yourbusiness.com"
              className="w-full max-w-md"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="businessCategory">Business Category *</Label>
            <Select value={formData.businessCategory} onValueChange={(value) => handleInputChange('businessCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-cars">New Cars Dealer</SelectItem>
                <SelectItem value="used-cars">Used Cars Dealer</SelectItem>
                <SelectItem value="both">New & Used Cars</SelectItem>
                <SelectItem value="multi-brand">Multi-Brand Dealer</SelectItem>
                <SelectItem value="single-brand">Single Brand Dealer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Legal & Location Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gstNumber">GST Number *</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
              className="w-full max-w-md"
            />
            {formData.gstNumber && !validateGST(formData.gstNumber) && (
              <p className="text-sm text-red-500 mt-1">Please enter a valid GST number</p>
            )}
          </div>
          <div>
            <Label htmlFor="yearsInBusiness">Years in Business *</Label>
            <Select value={formData.yearsInBusiness} onValueChange={(value) => handleInputChange('yearsInBusiness', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="shopAddress">Shop Address *</Label>
            <Textarea
              id="shopAddress"
              value={formData.shopAddress}
              onChange={(e) => handleInputChange('shopAddress', e.target.value)}
              placeholder="Complete shop address with landmarks"
              rows={3}
              className="w-full max-w-lg"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
              placeholder="400001"
              maxLength={6}
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="operatingHours">Operating Hours</Label>
            <Input
              id="operatingHours"
              value={formData.operatingHours}
              onChange={(e) => handleInputChange('operatingHours', e.target.value)}
              placeholder="9:00 AM - 7:00 PM"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gstCertificate">GST Certificate *</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="gstCertificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('gstCertificate', e.target.files)}
                className="hidden"
              />
              <label htmlFor="gstCertificate" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.gstCertificate ? 
                    `Selected: ${formData.documents.gstCertificate.name}` : 
                    'Click to upload GST certificate (PDF, JPG, PNG)'
                  }
                </p>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="shopLicense">Shop License/Registration *</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="shopLicense"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('shopLicense', e.target.files)}
                className="hidden"
              />
              <label htmlFor="shopLicense" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.shopLicense ? 
                    `Selected: ${formData.documents.shopLicense.name}` : 
                    'Click to upload shop license (PDF, JPG, PNG)'
                  }
                </p>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="ownerIdProof">Owner ID Proof *</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="ownerIdProof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('ownerIdProof', e.target.files)}
                className="hidden"
              />
              <label htmlFor="ownerIdProof" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.ownerIdProof ? 
                    `Selected: ${formData.documents.ownerIdProof.name}` : 
                    'Click to upload Aadhar/PAN/Passport (PDF, JPG, PNG)'
                  }
                </p>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="shopPhotos">Shop Photos (Optional)</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="shopPhotos"
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={(e) => handleFileUpload('shopPhotos', e.target.files)}
                className="hidden"
              />
              <label htmlFor="shopPhotos" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.shopPhotos.length > 0 ? 
                    `Selected: ${formData.documents.shopPhotos.length} photos` : 
                    'Click to upload shop photos (JPG, PNG)'
                  }
                </p>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))}
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the Terms & Conditions and Privacy Policy *
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

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

            <Card className="p-6 md:p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              {/* Step Content */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep} className="w-full sm:w-auto flex items-center">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full sm:w-auto flex items-center bg-green-600 hover:bg-green-700"
                    disabled={!validateStep(3)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DealerRegister;
