
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface CarDetailsStepProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  validateKilometersDriven: (km: string) => { valid: boolean; message: string };
}

const CarDetailsStep = ({ formData, setFormData, validateKilometersDriven }: CarDetailsStepProps) => {
  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const handleDateSelect = (field: keyof SellCarFormData, date: Date | undefined) => {
    if (date) {
      handleFieldChange(field, date.toISOString());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Car Details</h2>
        <p className="text-gray-600 text-sm mb-6">
          Tell us about your car's basic information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make */}
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium">
            Make *
          </Label>
          <Select value={formData.make} onValueChange={(value) => handleFieldChange('make', value)}>
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
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleFieldChange('model', e.target.value)}
            placeholder="e.g., Swift, i20, Nexon"
          />
        </div>

        {/* Variant */}
        <div className="space-y-2">
          <Label htmlFor="variant" className="text-sm font-medium">
            Variant
          </Label>
          <Input
            id="variant"
            value={formData.variant}
            onChange={(e) => handleFieldChange('variant', e.target.value)}
            placeholder="e.g., VXI, Asta, XZ+"
          />
        </div>

        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            Model Year *
          </Label>
          <Select value={formData.year} onValueChange={(value) => handleFieldChange('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 25 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
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
            <SelectContent>
              {Array.from({ length: 25 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Registration State */}
        <div className="space-y-2">
          <Label htmlFor="registrationState" className="text-sm font-medium">
            Registration State *
          </Label>
          <Select value={formData.registrationState} onValueChange={(value) => handleFieldChange('registrationState', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Karnataka">Karnataka</SelectItem>
              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              <SelectItem value="Telangana">Telangana</SelectItem>
              <SelectItem value="Gujarat">Gujarat</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
              <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
              <SelectItem value="West Bengal">West Bengal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fitness Certificate Valid Till */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-medium">
            Fitness Certificate Valid Till *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.fitnessCertificateValidTill && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.fitnessCertificateValidTill ? (
                  format(new Date(formData.fitnessCertificateValidTill), "PPP")
                ) : (
                  <span>Select fitness certificate validity date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.fitnessCertificateValidTill ? new Date(formData.fitnessCertificateValidTill) : undefined}
                onSelect={(date) => handleDateSelect('fitnessCertificateValidTill', date)}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
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
            <SelectContent>
              <SelectItem value="1">1st Owner</SelectItem>
              <SelectItem value="2">2nd Owner</SelectItem>
              <SelectItem value="3">3rd Owner</SelectItem>
              <SelectItem value="4">4+ Owners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seating Capacity */}
        <div className="space-y-2">
          <Label htmlFor="seatingCapacity" className="text-sm font-medium">
            Seating Capacity *
          </Label>
          <Select value={formData.seatingCapacity} onValueChange={(value) => handleFieldChange('seatingCapacity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectContent>
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
            <SelectContent>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="Automatic">Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
    </div>
  );
};

export default CarDetailsStep;
