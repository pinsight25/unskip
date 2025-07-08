
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, IndianRupee, Calendar, Shield, Wrench, FileText } from 'lucide-react';

interface PricingStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
}

const PricingStep = ({ formData, setFormData, validatePrice }: PricingStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Pricing & Documentation</h2>
        <p className="text-sm text-gray-600">Set your price and provide essential documentation details</p>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <IndianRupee className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Pricing</h3>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Expected Price *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <Input 
              type="number" 
              placeholder="8,50,000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="h-10 pl-8 w-full max-w-md"
            />
          </div>
          {formData.price && !validatePrice(formData.price).valid && (
            <div className="flex items-center mt-1 text-sm text-orange-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-xs">{validatePrice(formData.price).message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Switch
            checked={formData.isRentAvailable}
            onCheckedChange={(checked) => setFormData({ ...formData, isRentAvailable: checked })}
          />
          <Label className="text-sm">Also available for rent</Label>
        </div>

        {formData.isRentAvailable && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 p-4 bg-orange-50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Daily Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  type="number" 
                  placeholder="2500"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  className="h-10 pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Weekly Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  type="number" 
                  placeholder="15000"
                  value={formData.weeklyRate}
                  onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                  className="h-10 pl-8"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Insurance Details</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Insurance Valid Till *</Label>
            <Input 
              type="date"
              value={formData.insuranceValidTill}
              onChange={(e) => setFormData({ ...formData, insuranceValidTill: e.target.value })}
              className="h-10 w-full max-w-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Insurance Type *</Label>
            <Select value={formData.insuranceType} onValueChange={(value) => setFormData({ ...formData, insuranceType: value })}>
              <SelectTrigger className="h-10 w-full max-w-md">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                <SelectItem value="Third Party">Third Party</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Service History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Service History</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Last Service Date</Label>
            <Input 
              type="date"
              value={formData.lastServiceDate}
              onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
              className="h-10 w-full max-w-md"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.authorizedServiceCenter}
              onCheckedChange={(checked) => setFormData({ ...formData, authorizedServiceCenter: checked })}
            />
            <Label className="text-sm">Car serviced at authorized service center</Label>
          </div>
        </div>
      </div>

      {/* RTO Transfer Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Registration Transfer</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.rtoTransferSupport}
            onCheckedChange={(checked) => setFormData({ ...formData, rtoTransferSupport: checked })}
          />
          <Label className="text-sm">I will assist buyer with RC (Registration Certificate) transfer</Label>
        </div>
        <p className="text-xs text-gray-500 ml-6">This increases buyer confidence and helps sell faster</p>
      </div>
    </div>
  );
};

export default PricingStep;
