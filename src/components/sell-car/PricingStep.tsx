
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, IndianRupee, TrendingUp, ShieldCheck, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SellCarFormData } from '@/hooks/useSellCarForm';
import { updateFormField } from '@/utils/formHelpers';

interface PricingStepProps {
  formData: SellCarFormData;
  setFormData: (updater: (prev: SellCarFormData) => SellCarFormData) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
}

const PricingStep = ({ formData, setFormData, validatePrice }: PricingStepProps) => {
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
        <h2 className="text-xl font-semibold mb-4">Pricing & Additional Details</h2>
        <p className="text-gray-600 text-sm mb-6">
          Set your asking price and provide vehicle condition information
        </p>
      </div>

      {/* Pricing Section */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Pricing Information</h3>
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
              />
              <p className="text-xs text-gray-500">
                Buyers can make offers starting from {formData.offerPercentage || 70}% of your asking price
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insurance Section */}
      <div className="bg-green-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Insurance Information</h3>
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
          <div className="space-y-4 ml-6">
            <div className="space-y-2">
              <Label htmlFor="insuranceType" className="text-sm font-medium">
                Insurance Type *
              </Label>
              <Select value={formData.insuranceType} onValueChange={(value) => handleFieldChange('insuranceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="Third Party">Third Party</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Insurance Valid Till *
              </Label>
              <Popover>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.insuranceValidTill ? new Date(formData.insuranceValidTill) : undefined}
                    onSelect={(date) => handleDateSelect('insuranceValidTill', date)}
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
      <div className="bg-purple-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-800">Service History</h3>
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
          <div className="space-y-4 ml-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Last Service Date *
              </Label>
              <Popover>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.lastServiceDate ? new Date(formData.lastServiceDate) : undefined}
                    onSelect={(date) => handleDateSelect('lastServiceDate', date)}
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
                <SelectContent>
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
