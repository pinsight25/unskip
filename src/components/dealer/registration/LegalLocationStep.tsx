
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface LegalLocationStepProps {
  formData: DealerFormData;
  onInputChange: (field: keyof DealerFormData, value: any) => void;
  validateGST: (gst: string) => boolean;
}

const LegalLocationStep = ({ formData, onInputChange, validateGST }: LegalLocationStepProps) => {
  const openingTimes = [
    { value: '6-am', label: '6 AM' },
    { value: '7-am', label: '7 AM' },
    { value: '8-am', label: '8 AM' },
    { value: '9-am', label: '9 AM' },
    { value: '10-am', label: '10 AM' }
  ];

  const closingTimes = [
    { value: '5-pm', label: '5 PM' },
    { value: '6-pm', label: '6 PM' },
    { value: '7-pm', label: '7 PM' },
    { value: '8-pm', label: '8 PM' },
    { value: '9-pm', label: '9 PM' },
    { value: '10-pm', label: '10 PM' }
  ];

  const handleOperatingHoursChange = (field: 'openingTime' | 'closingTime' | 'is24x7', value: any) => {
    const currentHours = formData.operatingHours || { openingTime: '', closingTime: '', is24x7: false };
    
    if (field === 'is24x7' && value) {
      // If 24x7 is checked, clear opening/closing times
      onInputChange('operatingHours', { ...currentHours, is24x7: true, openingTime: '', closingTime: '' });
    } else {
      onInputChange('operatingHours', { ...currentHours, [field]: value });
    }
  };

  const operatingHours = formData.operatingHours || { openingTime: '', closingTime: '', is24x7: false };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Legal & Location Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gstNumber">GST Number *</Label>
            <Input
              id="gstNumber"
              placeholder="22AAAAA0000A1Z5"
              value={formData.gstNumber}
              onChange={(e) => onInputChange('gstNumber', e.target.value)}
              className={!validateGST(formData.gstNumber) && formData.gstNumber ? 'border-red-500' : ''}
            />
            {!validateGST(formData.gstNumber) && formData.gstNumber && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid GST number</p>
            )}
          </div>

          <div>
            <Label htmlFor="shopAddress">Shop Address *</Label>
            <Textarea
              id="shopAddress"
              placeholder="Complete shop address"
              rows={3}
              value={formData.shopAddress}
              onChange={(e) => onInputChange('shopAddress', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                placeholder="600001"
                value={formData.pincode}
                onChange={(e) => onInputChange('pincode', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="establishmentYear">Establishment Year *</Label>
              <Select 
                value={formData.establishmentYear} 
                onValueChange={(value) => onInputChange('establishmentYear', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Operating Hours *</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is24x7"
                  checked={operatingHours.is24x7}
                  onCheckedChange={(checked) => handleOperatingHoursChange('is24x7', checked)}
                />
                <Label htmlFor="is24x7">24/7 Service</Label>
              </div>
              
              {!operatingHours.is24x7 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <Select 
                      value={operatingHours.openingTime}
                      onValueChange={(value) => handleOperatingHoursChange('openingTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select opening time" />
                      </SelectTrigger>
                      <SelectContent>
                        {openingTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <Select 
                      value={operatingHours.closingTime}
                      onValueChange={(value) => handleOperatingHoursChange('closingTime', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select closing time" />
                      </SelectTrigger>
                      <SelectContent>
                        {closingTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              placeholder="https://your-website.com"
              value={formData.websiteUrl}
              onChange={(e) => onInputChange('websiteUrl', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="googleMapsLink">Google Maps Link</Label>
            <Input
              id="googleMapsLink"
              placeholder="https://maps.google.com/..."
              value={formData.googleMapsLink}
              onChange={(e) => onInputChange('googleMapsLink', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLocationStep;
