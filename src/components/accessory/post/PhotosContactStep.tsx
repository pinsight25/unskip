
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Plus, CheckCircle } from 'lucide-react';
import { AccessoryFormData } from '@/hooks/useAccessoryForm';
import { useUser } from '@/contexts/UserContext';
import { updateFormField, toBoolean } from '@/utils/formHelpers';

interface PhotosContactStepProps {
  formData: AccessoryFormData;
  onUpdate: (field: keyof AccessoryFormData, value: any) => void;
  onPhoneVerification: () => void;
}

const PhotosContactStep = ({ formData, onUpdate, onPhoneVerification }: PhotosContactStepProps) => {
  const { user, isSignedIn } = useUser();
  
  // Pre-fill phone if user is signed in
  const displayPhone = isSignedIn && user?.phone ? user.phone : formData.phone;
  const isPhoneVerified = isSignedIn && user?.phone;

  const handlePhoneVerification = () => {
    onPhoneVerification();
    setTimeout(() => {
      // Use updateFormField for boolean field
      const updatedData = updateFormField(formData, 'phoneVerified', true);
      onUpdate('phoneVerified', updatedData.phoneVerified);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Photos & Contact</h2>
        <div className="space-y-6">
          {/* Photos Section */}
          <div>
            <Label className="text-base font-medium">Photos</Label>
            <p className="text-sm text-gray-600 mb-3">
              Upload up to 2 photos of your accessory. First photo will be the main image.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2].map((index) => (
                <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">
                      Add Photo {index}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add More Photos
            </Button>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={displayPhone}
                  onChange={(e) => onUpdate('phone', e.target.value)}
                  className="flex-1"
                  disabled={isSignedIn && user?.phone}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handlePhoneVerification}
                  disabled={isPhoneVerified || toBoolean(formData.phoneVerified) || !displayPhone}
                >
                  {isPhoneVerified || toBoolean(formData.phoneVerified) ? 'Verified' : 'Verify'}
                </Button>
              </div>
              {(isPhoneVerified || toBoolean(formData.phoneVerified)) && (
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Phone number verified</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => onUpdate('email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, Area"
                value={formData.location}
                onChange={(e) => onUpdate('location', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotosContactStep;
