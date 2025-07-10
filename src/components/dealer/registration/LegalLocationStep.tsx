
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    </div>
  );
};

export default LegalLocationStep;
