
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface LegalLocationStepProps {
  formData: DealerFormData;
  onInputChange: (field: string, value: string) => void;
  validateGST: (gst: string) => boolean;
}

const LegalLocationStep = ({ formData, onInputChange, validateGST }: LegalLocationStepProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const setQuickHours = (hours: string) => {
    onInputChange('operatingHours', hours);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Legal & Location Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gstNumber">GST Number *</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => onInputChange('gstNumber', e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
              className="w-full max-w-md"
            />
            {formData.gstNumber && !validateGST(formData.gstNumber) && (
              <p className="text-sm text-red-500 mt-1">Please enter a valid GST number</p>
            )}
          </div>
          <div>
            <Label htmlFor="establishmentYear">Establishment Year *</Label>
            <Select value={formData.establishmentYear} onValueChange={(value) => onInputChange('establishmentYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="shopAddress">Shop Address *</Label>
            <Textarea
              id="shopAddress"
              value={formData.shopAddress}
              onChange={(e) => onInputChange('shopAddress', e.target.value)}
              placeholder="Complete shop address with landmarks"
              rows={3}
              className="w-full max-w-lg"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => onInputChange('pincode', e.target.value.replace(/\D/g, ''))}
              placeholder="400001"
              maxLength={6}
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              value={formData.websiteUrl}
              onChange={(e) => onInputChange('websiteUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full max-w-md"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="googleMapsLink">Google Maps Link</Label>
            <Input
              id="googleMapsLink"
              value={formData.googleMapsLink}
              onChange={(e) => onInputChange('googleMapsLink', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="operatingHours">Operating Hours</Label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuickHours('9:00 AM - 7:00 PM')}
            >
              Standard (9 AM - 7 PM)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuickHours('9:00 AM - 9:00 PM')}
            >
              Extended (9 AM - 9 PM)
            </Button>
          </div>
          <Input
            id="operatingHours"
            value={formData.operatingHours}
            onChange={(e) => onInputChange('operatingHours', e.target.value)}
            placeholder="9:00 AM - 7:00 PM or enter custom hours"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default LegalLocationStep;
