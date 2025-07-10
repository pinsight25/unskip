
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface MakeModelSelectorProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
}

// Car models by make
const carModels: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Vitara Brezza', 'Ertiga', 'Wagon R', 'Alto', 'Celerio', 'Ciaz', 'S-Cross', 'XL6', 'Ignis'],
  'Hyundai': ['i20', 'Creta', 'Verna', 'Venue', 'Grand i10', 'Santro', 'Elantra', 'Tucson', 'Kona', 'Alcazar'],
  'Tata': ['Nexon', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Tigor', 'Punch', 'Hexa', 'Zest'],
  'Mahindra': ['XUV700', 'XUV300', 'Scorpio', 'Thar', 'Bolero', 'KUV100', 'Marazzo', 'XUV500'],
  'Honda': ['City', 'Amaze', 'Jazz', 'WR-V', 'CR-V', 'Civic', 'BR-V'],
  'Toyota': ['Innova Crysta', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry', 'Yaris'],
  'Ford': ['EcoSport', 'Endeavour', 'Figo', 'Freestyle', 'Aspire'],
  'Volkswagen': ['Polo', 'Vento', 'Tiguan', 'T-Roc', 'Passat']
};

// Common variants for popular models
const carVariants: Record<string, string[]> = {
  'Swift': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
  'Baleno': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
  'Dzire': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
  'i20': ['Magna', 'Sportz', 'Asta'],
  'Creta': ['E', 'EX', 'S', 'SX'],
  'Nexon': ['XE', 'XM', 'XT', 'XZ', 'XZ+'],
  'City': ['V', 'VX', 'ZX'],
  'Innova Crysta': ['GX', 'VX', 'ZX'],
};

const MakeModelSelector = ({ formData, setFormData }: MakeModelSelectorProps) => {
  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const handleMakeChange = (make: string) => {
    handleFieldChange('make', make);
    // Clear model and variant when make changes
    handleFieldChange('model', '');
    handleFieldChange('variant', '');
  };

  const handleModelChange = (model: string) => {
    handleFieldChange('model', model);
    // Clear variant when model changes
    handleFieldChange('variant', '');
  };

  const availableModels = formData.make ? carModels[formData.make] || [] : [];
  const availableVariants = formData.model ? carVariants[formData.model] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Make */}
      <div className="space-y-2">
        <Label htmlFor="make" className="text-sm font-medium">
          Make *
        </Label>
        <Select value={formData.make} onValueChange={handleMakeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Maruti Suzuki">Maruti Suzuki</SelectItem>
            <SelectItem value="Hyundai">Hyundai</SelectItem>
            <SelectItem value="Tata">Tata</SelectItem>
            <SelectItem value="Mahindra">Mahindra</SelectItem>
            <SelectItem value="Honda">Honda</SelectItem>
            <SelectItem value="Toyota">Toyota</SelectItem>
            <SelectItem value="Ford">Ford</SelectItem>
            <SelectItem value="Volkswagen">Volkswagen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium">
          Model *
        </Label>
        <Select value={formData.model} onValueChange={handleModelChange} disabled={!formData.make}>
          <SelectTrigger>
            <SelectValue placeholder={formData.make ? "Select model" : "Select make first"} />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Variant */}
      <div className="space-y-2">
        <Label htmlFor="variant" className="text-sm font-medium">
          Variant
        </Label>
        <Select value={formData.variant} onValueChange={(value) => handleFieldChange('variant', value)} disabled={!formData.model}>
          <SelectTrigger>
            <SelectValue placeholder={formData.model ? "Select variant" : "Select model first"} />
          </SelectTrigger>
          <SelectContent>
            {availableVariants.map((variant) => (
              <SelectItem key={variant} value={variant}>{variant}</SelectItem>
            ))}
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MakeModelSelector;
