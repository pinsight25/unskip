
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface BusinessInformationStepProps {
  formData: DealerFormData;
  onInputChange: (field: string, value: string | string[]) => void;
  fieldErrors?: Record<string, string>;
}

const BusinessInformationStep = ({ formData, onInputChange, fieldErrors = {} }: BusinessInformationStepProps) => {
  const availableBrands = [
    'Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra',
    'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Skoda',
    'Ford', 'Renault', 'Nissan', 'MG', 'Jeep', 'Citroen'
  ];

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
              className={`w-full max-w-md ${fieldErrors.businessName ? 'border-red-500' : ''}`}
            />
            {fieldErrors.businessName && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.businessName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => onInputChange('contactPerson', e.target.value)}
              placeholder="Owner/Manager name"
              className={`w-full max-w-md ${fieldErrors.contactPerson ? 'border-red-500' : ''}`}
            />
            {fieldErrors.contactPerson && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.contactPerson}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value.replace(/\D/g, ''))}
              placeholder="+91 98765 43210"
              maxLength={15}
              className={`w-full max-w-md ${fieldErrors.phone ? 'border-red-500' : ''}`}
            />
            {fieldErrors.phone && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.phone}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="contact@yourbusiness.com"
              className={`w-full max-w-md ${fieldErrors.email ? 'border-red-500' : ''}`}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="businessCategory">Business Category *</Label>
            <Select value={formData.businessCategory} onValueChange={(value) => onInputChange('businessCategory', value)}>
              <SelectTrigger className={fieldErrors.businessCategory ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-cars">New Cars Only</SelectItem>
                <SelectItem value="used-cars">Used Cars Only</SelectItem>
                <SelectItem value="new-used">New & Used Cars</SelectItem>
                <SelectItem value="specialized">Specialized (Luxury/Vintage/Electric)</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.businessCategory && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.businessCategory}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Select value={formData.specialization} onValueChange={(value) => onInputChange('specialization', value)}>
              <SelectTrigger className={fieldErrors.specialization ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-brands">All Brands</SelectItem>
                <SelectItem value="luxury-cars">Luxury Cars</SelectItem>
                <SelectItem value="budget-cars">Budget Cars</SelectItem>
                <SelectItem value="electric">Electric Vehicles</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.specialization && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.specialization}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Brands Dealt With *</Label>
        <p className="text-sm text-gray-600 mb-3">Select all brands you deal with</p>
        <MultiSelect
          options={availableBrands}
          selected={formData.brandsDealWith || []}
          onChange={(selected) => onInputChange('brandsDealWith', selected)}
          placeholder="Select brands (multiple allowed)"
          className={`max-w-md ${fieldErrors.brandsDealWith ? 'border-red-500' : ''}`}
        />
        {fieldErrors.brandsDealWith && (
          <p className="text-sm text-red-500 mt-2">{fieldErrors.brandsDealWith}</p>
        )}
      </div>
      {/* About Field */}
      <div>
        <Label htmlFor="about" className="block mb-1">About Your Dealership *</Label>
        <textarea
          id="about"
          value={formData.about}
          onChange={e => onInputChange('about', e.target.value.slice(0, 150))}
          placeholder="Describe your dealership in 150 characters or less"
          maxLength={150}
          rows={3}
          className={`w-full max-w-md border rounded p-2 text-sm mb-2 ${fieldErrors.about ? 'border-red-500' : ''}`}
          required
        />
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1 mb-1" style={{ maxWidth: '28rem' }}>
          <span>{formData.about?.length || 0}/150 characters</span>
        </div>
        {fieldErrors.about && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.about}</p>
        )}
      </div>
    </div>
  );
};

export default BusinessInformationStep;
