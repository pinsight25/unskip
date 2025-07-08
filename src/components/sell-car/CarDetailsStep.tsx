
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface CarDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validateMileage: (mileage: string) => { valid: boolean; message: string };
}

const CarDetailsStep = ({ formData, setFormData, validateMileage }: CarDetailsStepProps) => {
  const makes = ['Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Mahindra', 'Tata', 'Ford', 'Volkswagen', 'BMW', 'Mercedes'];
  const models = ['Swift', 'i20', 'City', 'Innova', 'XUV700', 'Harrier', 'EcoSport', 'Polo', 'X1', 'C-Class'];
  const variants = ['Base', 'Mid', 'Top', 'VXI', 'ZXI', 'SX', 'VDI', 'Diesel', 'Petrol'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-2">Car Details</h2>
        <p className="text-sm text-gray-600">Tell us about your car's basic information</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Make *</Label>
            <Select value={formData.make} onValueChange={(value) => setFormData({ ...formData, make: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>{make}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Model *</Label>
            <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Variant/Trim</Label>
            <Select value={formData.variant} onValueChange={(value) => setFormData({ ...formData, variant: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Year *</Label>
            <Input 
              type="number" 
              placeholder="2020"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fuel Type *</Label>
            <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Transmission *</Label>
            <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mileage (km) *</Label>
            <Input 
              type="number" 
              placeholder="50000"
              value={formData.mileage}
              onChange={(e) => {
                setFormData({ ...formData, mileage: e.target.value });
              }}
              className="h-10"
            />
            {formData.mileage && !validateMileage(formData.mileage).valid && (
              <div className="flex items-center mt-1 text-sm text-orange-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-xs">{validateMileage(formData.mileage).message}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <Input 
              placeholder="White"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsStep;
