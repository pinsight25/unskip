
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { updateFormField } from '@/utils/formHelpers';

interface ReviewStepProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

const ReviewStep = ({ formData, setFormData }: ReviewStepProps) => {
  const handleTermsChange = (checked: boolean) => {
    setFormData(prev => updateFormField(prev, 'termsAccepted', checked));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Review & Post</h2>
        <p className="text-gray-600 text-sm mb-6">
          Please review your information and accept the terms to post your car listing
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Your car listing is ready!</h3>
            <p className="text-blue-700 text-sm mb-3">
              Once posted, your listing will be visible to thousands of potential buyers immediately.
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Buyers can contact you directly via phone or WhatsApp</li>
              <li>• You'll receive notifications for inquiries and offers</li>
              <li>• You can edit or remove your listing anytime</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
        <Checkbox 
          id="termsAccepted"
          checked={formData.termsAccepted}
          onCheckedChange={handleTermsChange}
          className="mt-0.5"
        />
        <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
          I agree to the <span className="text-primary underline cursor-pointer">Terms & Conditions</span> and confirm that all information provided is accurate. I understand that providing false information may result in my listing being removed.
        </Label>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
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
