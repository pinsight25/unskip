
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCarMakes } from '@/hooks/useCarMakes';
import { useCarModels } from '@/hooks/useCarModels';
import { updateFormField } from '@/utils/formHelpers';

interface MakeModelSelectorProps {
  make: string;
  model: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

const MakeModelSelector = ({ make, model, onMakeChange, onModelChange }: MakeModelSelectorProps) => {
  const { makes, isLoading: makesLoading } = useCarMakes();
  
  // Find the selected make ID for fetching models
  const selectedMake = makes.find(m => m.name === make);
  const { models, isLoading: modelsLoading } = useCarModels(selectedMake?.id);

  const handleMakeChange = (value: string) => {
    onMakeChange(value);
    // Clear model when make changes
    onModelChange('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="make">Make *</Label>
        <Select value={make} onValueChange={handleMakeChange}>
          <SelectTrigger>
            <SelectValue placeholder={makesLoading ? "Loading makes..." : "Select Make"} />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto">
            {makes.map((makeOption) => (
              <SelectItem key={makeOption.id} value={makeOption.name}>
                {makeOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="model">Model *</Label>
        <Select value={model} onValueChange={onModelChange} disabled={!make || modelsLoading}>
          <SelectTrigger>
            <SelectValue placeholder={
              !make ? "Select Make first" : 
              modelsLoading ? "Loading models..." : 
              "Select Model"
            } />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto">
            {models.map((modelOption) => (
              <SelectItem key={modelOption.id} value={modelOption.name}>
                {modelOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MakeModelSelector;
