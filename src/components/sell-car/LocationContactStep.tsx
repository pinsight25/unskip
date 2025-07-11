
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle } from 'lucide-react';
import { updateFormField } from '@/utils/formHelpers';
import { useCities } from '@/hooks/useCities';
import type { SellCarFormData } from '@/hooks/useSellCarForm';

interface LocationContactStepProps {
  formData: SellCarFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellCarFormData>>;
  onPhoneVerification: () => void;
}

const LocationContactStep = ({ formData, setFormData, onPhoneVerification }: LocationContactStepProps) => {
  const { cities, isLoading: citiesLoading } = useCities();

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => setFormData(prev => updateFormField(prev, 'city', value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={citiesLoading ? "Loading cities..." : "Select City"} />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}{city.state && `, ${city.state}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="area">Area/Locality</Label>
            <Input
              id="area"
              placeholder="e.g., Andheri East, Koramangala"
              value={formData.area}
              onChange={(e) => setFormData(prev => updateFormField(prev, 'area', e.target.value))}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="landmark">Landmark (Optional)</Label>
          <Input
            id="landmark"
            placeholder="e.g., Near Metro Station, Mall"
            value={formData.landmark}
            onChange={(e) => setFormData(prev => updateFormField(prev, 'landmark', e.target.value))}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="address">Full Address</Label>
          <Textarea
            id="address"
            placeholder="Enter complete address where the car can be inspected"
            value={formData.address}
            onChange={(e) => setFormData(prev => updateFormField(prev, 'address', e.target.value))}
            rows={3}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sellerName">Your Name *</Label>
            <Input
              id="sellerName"
              placeholder="Enter your full name"
              value={formData.sellerName}
              onChange={(e) => setFormData(prev => updateFormField(prev, 'sellerName', e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => updateFormField(prev, 'email', e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => updateFormField(prev, 'phone', value))}
                  placeholder="Enter your phone number"
                />
              </div>
              <Button
                type="button"
                variant={formData.phoneVerified ? "default" : "outline"}
                onClick={onPhoneVerification}
                disabled={!formData.phone || formData.phoneVerified}
                className="shrink-0"
              >
                {formData.phoneVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verified
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
            {formData.phoneVerified && (
              <p className="text-sm text-green-600 mt-1">Phone number verified successfully</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Share any additional details about your car, special features, or selling reason..."
            value={formData.description}
            onChange={(e) => setFormData(prev => updateFormField(prev, 'description', e.target.value))}
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">
            A good description helps buyers understand your car better and can lead to faster sales.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationContactStep;
