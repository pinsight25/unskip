
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface LegalLocationStepProps {
  formData: DealerFormData;
  onInputChange: (field: keyof DealerFormData, value: any) => void;
  validateGST: (gst: string) => boolean;
}

const LegalLocationStep = ({ formData, onInputChange, validateGST }: LegalLocationStepProps) => {
  const handleGSTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gstValue = e.target.value.toUpperCase();
    onInputChange('gstNumber', gstValue);
  };

  const handle24x7Change = (checked: boolean | 'indeterminate') => {
    onInputChange('operatingHours', {
      ...formData.operatingHours,
      is24x7: checked === true,
      openingTime: checked === true ? '' : formData.operatingHours.openingTime,
      closingTime: checked === true ? '' : formData.operatingHours.closingTime,
    });
  };

  const handleOperatingHoursChange = (field: 'openingTime' | 'closingTime', value: string) => {
    onInputChange('operatingHours', {
      ...formData.operatingHours,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Legal Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Legal Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gstNumber">GST Number *</Label>
            <Input
              id="gstNumber"
              placeholder="22AAAAA0000A1Z5"
              value={formData.gstNumber}
              onChange={handleGSTChange}
              maxLength={15}
            />
            {formData.gstNumber && !validateGST(formData.gstNumber) && (
              <p className="text-xs text-red-600 mt-1">Invalid GST format (e.g., 22AAAAA0000A1Z5)</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Location & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="shopAddress">Shop Address *</Label>
            <Textarea
              id="shopAddress"
              placeholder="Full shop address with landmarks"
              value={formData.shopAddress}
              onChange={(e) => onInputChange('shopAddress', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              placeholder="400001"
              value={formData.pincode}
              onChange={(e) => onInputChange('pincode', e.target.value.replace(/\D/g, ''))}
              maxLength={6}
            />
          </div>
          <div>
            <Label htmlFor="establishmentYear">Establishment Year *</Label>
            <Input
              id="establishmentYear"
              type="number"
              placeholder="2010"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.establishmentYear}
              onChange={(e) => onInputChange('establishmentYear', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Business Operations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Business Operations</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://www.yourwebsite.com"
              value={formData.websiteUrl}
              onChange={(e) => onInputChange('websiteUrl', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-base font-medium">Operating Hours *</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is24x7"
                  checked={formData.operatingHours.is24x7}
                  onCheckedChange={handle24x7Change}
                />
                <Label htmlFor="is24x7" className="text-sm">Open 24x7</Label>
              </div>

              {!formData.operatingHours.is24x7 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openingTime">Opening Time *</Label>
                    <Select
                      value={formData.operatingHours.openingTime}
                      onValueChange={(value) => handleOperatingHoursChange('openingTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select opening time" />
                      </SelectTrigger>
                      <SelectContent>
                        {['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM'].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="closingTime">Closing Time *</Label>
                    <Select
                      value={formData.operatingHours.closingTime}
                      onValueChange={(value) => handleOperatingHoursChange('closingTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select closing time" />
                      </SelectTrigger>
                      <SelectContent>
                        {['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLocationStep;
