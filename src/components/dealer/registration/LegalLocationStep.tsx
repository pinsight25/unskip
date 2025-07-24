
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface LegalLocationStepProps {
  formData: DealerFormData;
  onInputChange: (field: keyof DealerFormData, value: any) => void;
  validateGST: (gst: string) => boolean;
}

const LegalLocationStep = ({ formData, onInputChange, validateGST }: LegalLocationStepProps) => {
  const [panError, setPanError] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [docNumberError, setDocNumberError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [yearError, setYearError] = useState('');

  const isValidPAN = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
  const isValidAadhaar = (v: string) => v.replace(/\D/g, '').length === 12;
  const isValidDocNumber = (v: string) => v.trim().length > 0;
  const isValidAddress = (v: string) => v.trim().length > 0;
  const isValidPincode = (v: string) => /^\d{6}$/.test(v);
  const isValidYear = (v: string) => /^\d{4}$/.test(v) && +v >= 1900 && +v <= 2025;

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
              onBlur={() => setPanError(!isValidPAN(formData.panNumber) ? 'PAN must be in format ABCDE1234F' : '')}
              placeholder="ABCDE1234F"
              maxLength={10}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              required
            />
            {panError && <p className="text-red-500 text-sm mt-1">{panError}</p>}
          </div>
          {/* Aadhaar Number */}
          <div>
            <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
            <Input
              id="aadhaarNumber"
              type="text"
              value={formData.aadhaarNumber}
              onChange={handleAadhaarChange}
              onBlur={() => setAadhaarError(!isValidAadhaar(formData.aadhaarNumber) ? 'Aadhaar must be 12 digits' : '')}
              placeholder="XXXX XXXX 1234"
              maxLength={12}
              required
            />
            {(formData.aadhaarNumber || '').length === 12 && (
              <p className="text-sm text-muted-foreground mt-1">
                Will be stored as: XXXX XXXX {(formData.aadhaarNumber || '').slice(-4)}
              </p>
            )}
            {aadhaarError && <p className="text-red-500 text-sm mt-1">{aadhaarError}</p>}
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
              onBlur={() => setDocNumberError(!isValidDocNumber(formData.businessDocNumber) ? 'Business document number is required' : '')}
              placeholder={docNumberPlaceholder}
              required
            />
            {docNumberError && <p className="text-red-500 text-sm mt-1">{docNumberError}</p>}
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
              onBlur={() => setAddressError(!isValidAddress(formData.shopAddress) ? 'Address is required' : '')}
              rows={3}
            />
            {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              placeholder="400001"
              value={formData.pincode}
              onChange={(e) => onInputChange('pincode', e.target.value.replace(/\D/g, ''))}
              onBlur={() => setPincodeError(!isValidPincode(formData.pincode) ? 'Pincode must be 6 digits' : '')}
              maxLength={6}
            />
            {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}
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
              onBlur={() => setYearError(!isValidYear(formData.establishmentYear) ? 'Year must be between 1900 and 2025' : '')}
            />
            {yearError && <p className="text-red-500 text-sm mt-1">{yearError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLocationStep;
