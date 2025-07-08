
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { IndianRupee, AlertCircle } from 'lucide-react';

interface PricingStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
}

const PricingStep = ({ formData, setFormData, validatePrice }: PricingStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Pricing</h2>
        <p className="text-sm text-gray-600">Set your asking price and preferences</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Asking Price *</Label>
          <div className="flex items-center">
            <IndianRupee className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <Input 
              type="number" 
              placeholder="650000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="flex-1 h-10"
            />
          </div>
          {formData.price && !validatePrice(formData.price).valid && (
            <div className="flex items-center text-sm text-orange-600">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-xs">{validatePrice(formData.price).message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Switch 
            checked={formData.acceptOffers}
            onCheckedChange={(checked) => setFormData({ ...formData, acceptOffers: checked })}
          />
          <Label className="text-sm">Accept offers below asking price?</Label>
        </div>

        {formData.acceptOffers && (
          <div className="ml-6 space-y-2">
            <Label className="text-sm font-medium">Minimum acceptable percentage</Label>
            <Select value={formData.offerPercentage} onValueChange={(value) => setFormData({ ...formData, offerPercentage: value })}>
              <SelectTrigger className="h-10 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">95% (-5%)</SelectItem>
                <SelectItem value="10">90% (-10%)</SelectItem>
                <SelectItem value="15">85% (-15%)</SelectItem>
                <SelectItem value="20">80% (-20%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Switch 
            checked={formData.isRentAvailable}
            onCheckedChange={(checked) => setFormData({ ...formData, isRentAvailable: checked })}
          />
          <Label className="text-sm">Also available for rent?</Label>
        </div>

        {formData.isRentAvailable && (
          <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Daily Rate *</Label>
              <div className="flex items-center">
                <IndianRupee className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <Input 
                  type="number" 
                  placeholder="1500"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  className="h-10"
                />
                <span className="ml-2 text-sm text-gray-500">/day</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Weekly Rate</Label>
              <div className="flex items-center">
                <IndianRupee className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <Input 
                  type="number" 
                  placeholder="9000"
                  value={formData.weeklyRate}
                  onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                  className="h-10"
                />
                <span className="ml-2 text-sm text-gray-500">/week</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Minimum Rental Period</Label>
              <Select value={formData.minRentalPeriod} onValueChange={(value) => setFormData({ ...formData, minRentalPeriod: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Security Deposit</Label>
              <div className="flex items-center">
                <IndianRupee className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                <Input 
                  type="number" 
                  placeholder="10000"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingStep;
