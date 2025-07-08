
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface BusinessInformationStepProps {
  formData: DealerFormData;
  onInputChange: (field: string, value: string | string[]) => void;
}

const BusinessInformationStep = ({ formData, onInputChange }: BusinessInformationStepProps) => {
  const availableBrands = [
    'Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra',
    'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Skoda',
    'Ford', 'Renault', 'Nissan', 'MG', 'Jeep', 'Citroen'
  ];

  const handleBrandChange = (brand: string, checked: boolean) => {
    const updatedBrands = checked
      ? [...formData.brandsDealWith, brand]
      : formData.brandsDealWith.filter(b => b !== brand);
    onInputChange('brandsDealWith', updatedBrands);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => onInputChange('businessName', e.target.value)}
              placeholder="Your dealership name"
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => onInputChange('contactPerson', e.target.value)}
              placeholder="Owner/Manager name"
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="+91 98765 43210"
              maxLength={15}
              className="w-full max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="contact@yourbusiness.com"
              className="w-full max-w-md"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="businessCategory">Business Category *</Label>
            <Select value={formData.businessCategory} onValueChange={(value) => onInputChange('businessCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-cars">New Cars Only</SelectItem>
                <SelectItem value="used-cars">Used Cars Only</SelectItem>
                <SelectItem value="new-used">New & Used Cars</SelectItem>
                <SelectItem value="specialized">Specialized (Luxury/Vintage/Electric)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Select value={formData.specialization} onValueChange={(value) => onInputChange('specialization', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-brands">All Brands</SelectItem>
                <SelectItem value="luxury-cars">Luxury Cars</SelectItem>
                <SelectItem value="budget-cars">Budget Cars</SelectItem>
                <SelectItem value="electric">Electric Vehicles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Brands Dealt With *</Label>
        <p className="text-sm text-gray-600 mb-3">Select all brands you deal with</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={formData.brandsDealWith.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                className="h-4 w-4"
              />
              <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
        {formData.brandsDealWith.length === 0 && (
          <p className="text-sm text-red-500 mt-2">Please select at least one brand</p>
        )}
      </div>
    </div>
  );
};

export default BusinessInformationStep;
