
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface VehicleConditionSelectorProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  validateKilometersDriven: (km: string) => { valid: boolean; message: string };
}

const VehicleConditionSelector = ({ formData, setFormData, validateKilometersDriven }: VehicleConditionSelectorProps) => {
  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Kilometers Driven */}
      <div className="space-y-2">
        <Label htmlFor="kilometersDriven" className="text-sm font-medium">
          Kilometers Driven *
        </Label>
        <Input
          id="kilometersDriven"
          type="number"
          value={formData.kilometersDriven}
          onChange={(e) => handleFieldChange('kilometersDriven', e.target.value)}
          placeholder="e.g., 45000"
        />
        {formData.kilometersDriven && !validateKilometersDriven(formData.kilometersDriven).valid && (
          <p className="text-sm text-red-600">{validateKilometersDriven(formData.kilometersDriven).message}</p>
        )}
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label htmlFor="color" className="text-sm font-medium">
          Color *
        </Label>
        <Select value={formData.color} onValueChange={(value) => handleFieldChange('color', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="White">White</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
            <SelectItem value="Black">Black</SelectItem>
            <SelectItem value="Red">Red</SelectItem>
            <SelectItem value="Blue">Blue</SelectItem>
            <SelectItem value="Grey">Grey</SelectItem>
            <SelectItem value="Brown">Brown</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleConditionSelector;
