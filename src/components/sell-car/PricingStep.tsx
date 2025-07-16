
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, IndianRupee, ShieldCheck, Wrench, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface PricingStepProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  updateFormData: (updates: Partial<SellCarFormData>) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
}

const PricingStep = ({ formData, setFormData, updateFormData, validatePrice }: PricingStepProps) => {
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const handleFieldChange = (field: keyof SellCarFormData, value: any) => {
    console.log('🔄 Field changed:', field, value);
    updateFormData({ [field]: value });
  };

  const handleDateSelect = (field: keyof SellCarFormData, date: Date | undefined, closePopover?: () => void) => {
    if (date) {
      handleFieldChange(field, date.toISOString());
      if (closePopover) closePopover();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <p className="text-gray-600 text-sm mb-6">
          Set your asking price and provide vehicle condition information
        </p>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Pricing Information</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Asking Price (₹) *
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              placeholder="e.g., 450000"
              className="text-lg font-semibold"
              aria-label="Asking price in rupees"
            />
            {formData.price && !validatePrice(formData.price).valid && (
              <p className="text-sm text-red-600">{validatePrice(formData.price).message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptOffers"
              checked={formData.acceptOffers}
              onCheckedChange={(checked) => handleFieldChange('acceptOffers', checked)}
            />
            <Label htmlFor="acceptOffers" className="text-sm">
              Accept offers from buyers
            </Label>
          </div>

          {formData.acceptOffers && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="offerPercentage" className="text-sm font-medium">
                Minimum offer percentage (%)
              </Label>
              <Input
                id="offerPercentage"
                type="number"
                value={formData.offerPercentage}
                onChange={(e) => handleFieldChange('offerPercentage', e.target.value)}
                placeholder="70"
                min="50"
                max="95"
                aria-label="Minimum offer percentage"
              />
              <p className="text-xs text-gray-500">
                Buyers can make offers starting from {formData.offerPercentage || 70}% of your asking price
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Car Description Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Car Description</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Car Description (optional)
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Describe your car's condition, features, and why it's a great buy..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Add details about maintenance, accessories, or any special features
          </p>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Insurance Information</h3>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="insuranceValid"
            checked={formData.insuranceValid}
            onCheckedChange={(checked) => handleFieldChange('insuranceValid', checked)}
          />
          <Label htmlFor="insuranceValid" className="text-sm">
            Insurance is valid
          </Label>
        </div>

        {formData.insuranceValid && (
          <div className="space-y-4 ml-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="insuranceType" className="text-sm font-medium">
                Insurance Type *
              </Label>
              <Select value={formData.insuranceType} onValueChange={(value) => handleFieldChange('insuranceType', value)}>
                <SelectTrigger id="insuranceType">
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent 
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="max-h-[300px] overflow-y-auto z-50"
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="Third Party">Third Party</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Insurance Valid Till *
              </Label>
              <Popover open={insuranceOpen} onOpenChange={setInsuranceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.insuranceValidTill && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.insuranceValidTill ? (
                      format(new Date(formData.insuranceValidTill), "PPP")
                    ) : (
                      <span>Select insurance validity date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={formData.insuranceValidTill ? new Date(formData.insuranceValidTill) : undefined}
                    onSelect={(date) => handleDateSelect('insuranceValidTill', date, () => setInsuranceOpen(false))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>

      {/* Service History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Service History</h3>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="serviceHistory"
            checked={formData.serviceHistory}
            onCheckedChange={(checked) => handleFieldChange('serviceHistory', checked)}
          />
          <Label htmlFor="serviceHistory" className="text-sm">
            Complete service history available
          </Label>
        </div>

        {formData.serviceHistory && (
          <div className="space-y-4 ml-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Last Service Date *
              </Label>
              <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.lastServiceDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.lastServiceDate ? (
                      format(new Date(formData.lastServiceDate), "PPP")
                    ) : (
                      <span>Select last service date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={formData.lastServiceDate ? new Date(formData.lastServiceDate) : undefined}
                    onSelect={(date) => handleDateSelect('lastServiceDate', date, () => setServiceOpen(false))}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceCenterType" className="text-sm font-medium">
                Service Center Type *
              </Label>
              <Select value={formData.serviceCenterType} onValueChange={(value) => handleFieldChange('serviceCenterType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service center type" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="max-h-[300px]">
                  <SelectItem value="Authorized">Authorized Service Center</SelectItem>
                  <SelectItem value="Local Garage">Local Garage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Condition */}
      <div className="space-y-4">
        <h3 className="font-semibold">Vehicle Condition</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rtoTransferSupport"
              checked={formData.rtoTransferSupport}
              onCheckedChange={(checked) => handleFieldChange('rtoTransferSupport', checked)}
            />
            <Label htmlFor="rtoTransferSupport" className="text-sm">
              RC Transfer support available
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="noAccidentHistory"
              checked={formData.noAccidentHistory}
              onCheckedChange={(checked) => handleFieldChange('noAccidentHistory', checked)}
            />
            <Label htmlFor="noAccidentHistory" className="text-sm">
              No accident history
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingStep;
