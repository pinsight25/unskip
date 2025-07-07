
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
      <h2 className="text-xl font-semibold">Pricing</h2>
      <div className="space-y-4">
        <div>
          <Label>Asking Price *</Label>
          <div className="flex items-center mt-1">
            <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
            <Input 
              type="number" 
              placeholder="650000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="flex-1"
            />
          </div>
          {formData.price && !validatePrice(formData.price).valid && (
            <div className="flex items-center mt-1 text-sm text-orange-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {validatePrice(formData.price).message}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            checked={formData.acceptOffers}
            onCheckedChange={(checked) => setFormData({ ...formData, acceptOffers: checked })}
          />
          <Label>Accept offers below asking price?</Label>
        </div>

        {formData.acceptOffers && (
          <div className="ml-6">
            <Label>Minimum acceptable percentage</Label>
            <Select value={formData.offerPercentage} onValueChange={(value) => setFormData({ ...formData, offerPercentage: value })}>
              <SelectTrigger className="mt-1 w-32">
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
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={formData.isRentAvailable}
            onCheckedChange={(checked) => setFormData({ ...formData, isRentAvailable: checked })}
          />
          <Label>Also available for rent?</Label>
        </div>

        {formData.isRentAvailable && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <div>
              <Label>Daily Rate *</Label>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                <Input 
                  type="number" 
                  placeholder="1500"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                />
                <span className="ml-2 text-sm text-gray-500">/day</span>
              </div>
            </div>
            <div>
              <Label>Weekly Rate</Label>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                <Input 
                  type="number" 
                  placeholder="9000"
                  value={formData.weeklyRate}
                  onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })}
                />
                <span className="ml-2 text-sm text-gray-500">/week</span>
              </div>
            </div>
            <div>
              <Label>Minimum Rental Period</Label>
              <Select value={formData.minRentalPeriod} onValueChange={(value) => setFormData({ ...formData, minRentalPeriod: value })}>
                <SelectTrigger className="mt-1">
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
            <div>
              <Label>Security Deposit</Label>
              <div className="flex items-center mt-1">
                <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                <Input 
                  type="number" 
                  placeholder="10000"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
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
