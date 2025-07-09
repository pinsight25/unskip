import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface LegalLocationStepProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  validateGST: (gst: string) => boolean;
}

const LegalLocationStep = ({ formData, onInputChange, validateGST }: LegalLocationStepProps) => {
  const handleGSTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gstValue = e.target.value;
    onInputChange('gstNumber', gstValue);
  };

  return (
    <div className="space-y-6">
      {/* Legal Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Legal Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Legal Name *</Label>
            <Input
              id="businessName"
              placeholder="Your Business Legal Name"
              value={formData.businessName}
              onChange={(e) => onInputChange('businessName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gstNumber">GST Number *</Label>
            <Input
              id="gstNumber"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleGSTChange}
            />
            {!validateGST(formData.gstNumber) && formData.gstNumber.length > 0 && (
              <p className="text-xs text-red-600 mt-1">Invalid GST format</p>
            )}
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Location & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              placeholder="State"
              value={formData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) => onInputChange('pincode', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Business Operations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Business Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="establishmentYear">Establishment Year *</Label>
            <Input
              id="establishmentYear"
              type="number"
              placeholder="Year of Establishment"
              value={formData.establishmentYear}
              onChange={(e) => onInputChange('establishmentYear', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="Website URL"
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="operatingHoursStart">Opening Time *</Label>
            <Select
              value={formData.operatingHoursStart}
              onValueChange={(value) => onInputChange('operatingHoursStart', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select opening time" />
              </SelectTrigger>
              <SelectContent>
                {['6 AM', '7 AM', '8 AM', '9 AM', '10 AM'].map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="operatingHoursEnd">Closing Time *</Label>
            <Select
              value={formData.operatingHoursEnd}
              onValueChange={(value) => onInputChange('operatingHoursEnd', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select closing time" />
              </SelectTrigger>
              <SelectContent>
                {['5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'].map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="businessCategory">Business Category *</Label>
            <Select
              value={formData.businessCategory}
              onValueChange={(value) => onInputChange('businessCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {['New & Used', 'Used Only', 'Service Only', 'Other'].map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLocationStep;
