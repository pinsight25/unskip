
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccessoryFormData } from '@/hooks/useAccessoryForm';
import { accessoryCategories } from '@/data/accessoryMockData';

interface BasicInformationStepProps {
  formData: AccessoryFormData;
  onUpdate: (field: keyof AccessoryFormData, value: string) => void;
}

const BasicInformationStep = ({ formData, onUpdate }: BasicInformationStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="e.g., Premium Leather Seat Covers"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => onUpdate('category', value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
                <SelectContent>
                  {accessoryCategories.filter(cat => cat.id !== 'all').map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => onUpdate('brand', e.target.value)}
                placeholder="e.g., 3M, Bosch, etc."
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Price Range *</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="priceMin" className="text-sm">Minimum Price (₹)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  placeholder="1000"
                  value={formData.priceMin}
                  onChange={(e) => onUpdate('priceMin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="priceMax" className="text-sm">Maximum Price (₹)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  placeholder="5000"
                  value={formData.priceMax}
                  onChange={(e) => onUpdate('priceMax', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationStep;
