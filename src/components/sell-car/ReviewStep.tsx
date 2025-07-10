
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Car, CheckCircle, Crown, Shield, FileText, Settings } from 'lucide-react';
import { updateFormField } from '@/utils/formHelpers';

interface ReviewStepProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

const ReviewStep = ({ formData, setFormData }: ReviewStepProps) => {
  const getOwnershipText = (owners: string) => {
    if (owners === '1') return '1st Owner';
    if (owners === '2') return '2nd Owner';
    if (owners === '3') return '3rd Owner';
    return `${owners}th Owner`;
  };

  const getSelectedFeatures = () => {
    if (!formData.features) return [];
    return Object.entries(formData.features)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        // Convert camelCase to readable format
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      });
  };

  const handleTermsChange = (checked: boolean) => {
    setFormData(prev => updateFormField(prev, 'termsAccepted', checked));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Post</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">How your listing will appear:</h3>
        <Card>
          <CardContent className="p-6">
            {/* Car Title */}
            <div className="flex items-center space-x-4 mb-4">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">
                  {formData.make && formData.model ? 
                    `${formData.make} ${formData.model}${formData.variant ? ` ${formData.variant}` : ''}` : 
                    'Car Title'
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {formData.year || 'Year'} • {formData.fuelType || 'Fuel'} • {formData.transmission || 'Transmission'}
                </p>
              </div>
            </div>
            
            {/* Price Section */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-primary mb-2">
                ₹{formData.price ? Number(formData.price).toLocaleString() : '0'}
              </div>
            </div>

            {/* Ownership - Most Important */}
            {formData.numberOfOwners && (
              <div className="mb-4">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Crown className="h-3 w-3 mr-1" />
                  {getOwnershipText(formData.numberOfOwners)}
                </Badge>
              </div>
            )}

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {formData.kilometersDriven && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilometers:</span>
                  <span className="font-medium">{Number(formData.kilometersDriven).toLocaleString()} km</span>
                </div>
              )}
              {formData.area && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{formData.area}</span>
                </div>
              )}
              {formData.seatingCapacity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Seating:</span>
                  <span className="font-medium">{formData.seatingCapacity} Seater</span>
                </div>
              )}
              {formData.registrationState && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration:</span>
                  <span className="font-medium">{formData.registrationState}</span>
                </div>
              )}
              {formData.color && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{formData.color}</span>
                </div>
              )}
            </div>

            {/* Show selected features if any */}
            {getSelectedFeatures().length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Features:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {getSelectedFeatures().map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.acceptOffers && (
                <Badge variant="outline" className="text-xs">
                  Accepts offers (min {formData.offerPercentage || 70}%)
                </Badge>
              )}
              {formData.isRentAvailable && formData.dailyRate && (
                <Badge variant="outline" className="text-xs">
                  Rental: ₹{formData.dailyRate}/day
                </Badge>
              )}
              {formData.rtoTransferSupport && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  RC Transfer Support
                </Badge>
              )}
              {formData.insuranceValid && formData.insuranceType && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {formData.insuranceType} Insurance
                </Badge>
              )}
              {formData.noAccidentHistory && (
                <Badge variant="outline" className="text-xs">
                  No Accident History
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          checked={formData.termsAccepted}
          onCheckedChange={handleTermsChange}
        />
        <Label className="text-sm">
          I agree to the <span className="text-primary underline cursor-pointer">Terms & Conditions</span> and confirm that all information provided is accurate
        </Label>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Ready to post!</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Your listing will be live immediately and buyers can contact you directly.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
