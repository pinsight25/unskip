
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface YearSelectorProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
}

const YearSelector = ({ formData, setFormData }: YearSelectorProps) => {
  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  // Generate year options (2024 down to 1990)
  const yearOptions = Array.from({ length: 35 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year.toString();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year" className="text-sm font-medium">
          Model Year *
        </Label>
        <Select value={formData.year} onValueChange={(value) => handleFieldChange('year', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Registration Year */}
      <div className="space-y-2">
        <Label htmlFor="registrationYear" className="text-sm font-medium">
          Registration Year *
        </Label>
        <Select value={formData.registrationYear} onValueChange={(value) => handleFieldChange('registrationYear', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select registration year" />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default YearSelector;
