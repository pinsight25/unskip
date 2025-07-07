
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Car, CheckCircle } from 'lucide-react';

interface ReviewStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const ReviewStep = ({ formData, setFormData }: ReviewStepProps) => {
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
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Price:</span>
                <span className="ml-2 font-semibold text-primary">₹{formData.price ? Number(formData.price).toLocaleString() : '0'}</span>
              </div>
              <div>
                <span className="text-gray-600">Mileage:</span>
                <span className="ml-2">{formData.mileage} km</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2">{formData.area}</span>
              </div>
              {formData.isRentAvailable && (
                <div>
                  <span className="text-gray-600">Rental:</span>
                  <span className="ml-2">₹{formData.dailyRate}/day</span>
                </div>
              )}
            </div>
            {formData.acceptOffers && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">Accepts offers</Badge>
              </div>
            )}
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
