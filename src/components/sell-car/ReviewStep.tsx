
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Car, CheckCircle, Crown, Shield, FileText, Settings } from 'lucide-react';

interface ReviewStepProps {
  formData: any;
  setFormData: (data: any) => void;
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Post</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">How your listing will appear:</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{formData.make} {formData.model} {formData.variant}</h3>
                <p className="text-sm text-gray-600">{formData.year} • {formData.fuelType} • {formData.transmission}</p>
              </div>
            </div>
            
            {/* Ownership - Most Important */}
            {formData.numberOfOwners && (
              <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">{getOwnershipText(formData.numberOfOwners)}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2 font-semibold text-primary">₹{formData.price ? Number(formData.price).toLocaleString() : '0'}</span>
              </div>
              {formData.mileage && (
                <div>
                  <span className="text-gray-600">Mileage:</span>
                  <span className="ml-2">{formData.mileage} km</span>
                </div>
              )}
              {formData.area && (
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2">{formData.area}</span>
                </div>
              )}
              {formData.seatingCapacity && (
                <div>
                  <span className="text-gray-600">Seating:</span>
                  <span className="ml-2">{formData.seatingCapacity} Seater</span>
                </div>
              )}
              {formData.registrationState && (
                <div>
                  <span className="text-gray-600">Registration:</span>
                  <span className="ml-2">{formData.registrationState}</span>
                </div>
              )}
              {formData.color && (
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-2">{formData.color}</span>
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

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.acceptOffers && (
                <Badge variant="secondary" className="text-xs">
                  Accepts offers (min {formData.offerPercentage}%)
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
              {formData.insuranceType && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {formData.insuranceType} Insurance
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
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
