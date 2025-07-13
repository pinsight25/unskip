
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface VehicleSpecsSelectorProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
}

const VehicleSpecsSelector = ({ formData, setFormData }: VehicleSpecsSelectorProps) => {
  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Seating Capacity */}
      <div className="space-y-2">
        <Label htmlFor="seatingCapacity" className="text-sm font-medium">
          Seating Capacity *
        </Label>
        <Select value={formData.seatingCapacity} onValueChange={(value) => handleFieldChange('seatingCapacity', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select capacity" />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <SelectItem value="2">2 Seater</SelectItem>
            <SelectItem value="4">4 Seater</SelectItem>
            <SelectItem value="5">5 Seater</SelectItem>
            <SelectItem value="7">7 Seater</SelectItem>
            <SelectItem value="8">8 Seater</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <Label htmlFor="fuelType" className="text-sm font-medium">
          Fuel Type *
        </Label>
        <Select value={formData.fuelType} onValueChange={(value) => handleFieldChange('fuelType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <SelectItem value="Petrol">Petrol</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Electric">Electric</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="CNG">CNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <Label htmlFor="transmission" className="text-sm font-medium">
          Transmission *
        </Label>
        <Select value={formData.transmission} onValueChange={(value) => handleFieldChange('transmission', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <SelectItem value="Manual">Manual</SelectItem>
            <SelectItem value="Automatic">Automatic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Number of Owners */}
      <div className="space-y-2">
        <Label htmlFor="numberOfOwners" className="text-sm font-medium">
          Number of Owners *
        </Label>
        <Select value={formData.numberOfOwners} onValueChange={(value) => handleFieldChange('numberOfOwners', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select owners" />
          </SelectTrigger>
          <SelectContent 
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
            className="max-h-[300px] overflow-y-auto z-50"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <SelectItem value="1">1st Owner</SelectItem>
            <SelectItem value="2">2nd Owner</SelectItem>
            <SelectItem value="3">3rd Owner</SelectItem>
            <SelectItem value="4">4+ Owners</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleSpecsSelector;
