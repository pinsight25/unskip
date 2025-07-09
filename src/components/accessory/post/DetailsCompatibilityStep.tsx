
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { AccessoryFormData } from '@/hooks/useAccessoryForm';
import { updateFormField } from '@/utils/formHelpers';

interface DetailsCompatibilityStepProps {
  formData: AccessoryFormData;
  onUpdate: (field: keyof AccessoryFormData, value: string | string[] | boolean) => void;
}

const DetailsCompatibilityStep = ({ formData, onUpdate }: DetailsCompatibilityStepProps) => {
  const [newModel, setNewModel] = useState('');

  const popularCarModels = [
    'Swift', 'Baleno', 'WagonR', 'Alto', 'Verna', 'Creta', 'i20', 'Grand i10',
    'City', 'Amaze', 'Jazz', 'Thar', 'XUV300', 'Seltos', 'Sonet', 'Venue'
  ];

  const warrantyOptions = [
    { value: 'no-warranty', label: 'No Warranty' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: '2-years', label: '2 Years' }
  ];

  const addCompatibleModel = (model: string) => {
    if (model && !formData.compatibility.includes(model)) {
      onUpdate('compatibility', [...formData.compatibility, model]);
      setNewModel('');
    }
  };

  const removeCompatibleModel = (model: string) => {
    onUpdate('compatibility', formData.compatibility.filter(m => m !== model));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Details & Compatibility</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your accessory, its condition, features, etc."
              rows={4}
              value={formData.description}
              onChange={(e) => onUpdate('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => onUpdate('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="warranty">Warranty Period</Label>
              <Select value={formData.warranty} onValueChange={(value) => onUpdate('warranty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warranty period" />
                </SelectTrigger>
                <SelectContent>
                  {warrantyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="installation"
              checked={formData.installationAvailable}
              onCheckedChange={(checked) => onUpdate('installationAvailable', updateFormField({ installationAvailable: formData.installationAvailable }, 'installationAvailable', checked).installationAvailable)}
            />
            <Label htmlFor="installation" className="text-sm">
              Installation Service Available
            </Label>
          </div>

          <div>
            <Label className="text-base font-medium">Compatible Car Models</Label>
            <div className="space-y-3 mt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter car model"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompatibleModel(newModel))}
                />
                <Button type="button" onClick={() => addCompatibleModel(newModel)}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {popularCarModels.map((model) => (
                  <Button
                    key={model}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompatibleModel(model)}
                    disabled={formData.compatibility.includes(model)}
                  >
                    {model}
                  </Button>
                ))}
              </div>

              {formData.compatibility.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Models:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.compatibility.map((model) => (
                      <Badge key={model} variant="secondary" className="flex items-center gap-1">
                        {model}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeCompatibleModel(model)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCompatibilityStep;
