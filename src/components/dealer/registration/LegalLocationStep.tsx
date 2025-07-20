
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LegalLocationStepProps {
  formData: DealerFormData;
  onInputChange: (field: keyof DealerFormData, value: any) => void;
  validateGST: (gst: string) => boolean;
}

const LegalLocationStep = ({ formData, onInputChange, validateGST }: LegalLocationStepProps) => {
  // PAN and Aadhaar handlers
  const handlePANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('panNumber', e.target.value.toUpperCase());
  };
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    onInputChange('aadhaarNumber', value);
  };
  const handleBusinessDocTypeChange = (value: string) => {
    onInputChange('businessDocType', value);
    // Optionally clear businessDocNumber when type changes
    onInputChange('businessDocNumber', '');
  };
  const handleBusinessDocNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange('businessDocNumber', e.target.value.toUpperCase());
  };

  // Dynamic label and placeholder for business doc number
  const docNumberLabel =
    formData.businessDocType === 'gst_certificate' ? 'GST Number' :
    formData.businessDocType === 'msme_certificate' ? 'Udyam Registration Number' :
    'License/Registration Number';
  const docNumberPlaceholder =
    formData.businessDocType === 'gst_certificate' ? '22AAAAA0000A1Z5' :
    formData.businessDocType === 'msme_certificate' ? 'UDYAM-XX-00-0000000' :
    'Enter license number';

  return (
    <div className="space-y-6">
      {/* Legal Information */}
      <div>
        <h3 className="text-lg font-medium mb-4">Legal & KYC Information</h3>
        <div className="space-y-4">
          {/* PAN Number */}
          <div>
            <Label htmlFor="panNumber">PAN Number *</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={handlePANChange}
              placeholder="ABCDE1234F"
              maxLength={10}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              required
            />
          </div>
          {/* Aadhaar Number */}
          <div>
            <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
            <Input
              id="aadhaarNumber"
              type="text"
              value={formData.aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="XXXX XXXX 1234"
              maxLength={12}
              required
            />
            {(formData.aadhaarNumber || '').length === 12 && (
              <p className="text-sm text-muted-foreground mt-1">
                Will be stored as: XXXX XXXX {(formData.aadhaarNumber || '').slice(-4)}
              </p>
            )}
          </div>
          {/* Business Document Type */}
          <div>
            <Label htmlFor="businessDocType">Business Document Type *</Label>
            <Select
              value={formData.businessDocType}
              onValueChange={handleBusinessDocTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gst_certificate">GST Certificate</SelectItem>
                <SelectItem value="msme_certificate">MSME/Udyam Certificate</SelectItem>
                <SelectItem value="shop_license">Shop & Establishment License</SelectItem>
                <SelectItem value="trade_license">Trade License</SelectItem>
                <SelectItem value="other">Other Business Registration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Business Document Number (dynamic) */}
          <div>
            <Label htmlFor="businessDocNumber">{docNumberLabel} *</Label>
            <Input
              id="businessDocNumber"
              value={formData.businessDocNumber}
              onChange={handleBusinessDocNumberChange}
              placeholder={docNumberPlaceholder}
              required
            />
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
