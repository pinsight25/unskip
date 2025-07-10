
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface RegistrationDetailsSelectorProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
}

const RegistrationDetailsSelector = ({ formData, setFormData }: RegistrationDetailsSelectorProps) => {
  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    setFormData(prev => updateFormField(prev, field, value));
  };

  const handleDateSelect = (field: keyof SellCarFormData, date: Date | undefined) => {
    if (date) {
      handleFieldChange(field, date.toISOString());
    }
  };

  return (
    <div className="space-y-4">
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
      <div className="space-y-2">
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
    </div>
  );
};

export default RegistrationDetailsSelector;
