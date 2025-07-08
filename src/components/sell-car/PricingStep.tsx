
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

interface PricingStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
}

const PricingStep = ({ formData, setFormData, validatePrice }: PricingStepProps) => {
  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: checked
      }
    });
  };

  const getOfferPercentageLabel = (percentage: string) => {
    const price = Number(formData.price);
    if (!price) return `${percentage}% of asking price`;
    const minAmount = Math.round(price * (Number(percentage) / 100));
    return `${percentage}% (₹${minAmount.toLocaleString()})`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Pricing & Details</h2>
        <p className="text-sm text-gray-600">Set your price and key vehicle information</p>
      </div>

      {/* Simplified Pricing Section */}
      <div className="space-y-4">
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

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="accept-offers"
              checked={formData.acceptOffers}
              onCheckedChange={(checked) => setFormData({ ...formData, acceptOffers: checked })}
              className="h-5 w-5"
            />
            <Label htmlFor="accept-offers" className="text-sm cursor-pointer">Accept offers below asking price?</Label>
          </div>
          
          {formData.acceptOffers && (
            <div className="ml-8 space-y-2">
              <Label className="text-sm font-medium">Minimum acceptable offer</Label>
              <Select value={formData.offerPercentage} onValueChange={(value) => setFormData({ ...formData, offerPercentage: value })}>
                <SelectTrigger className="h-10 w-full max-w-md">
                  <SelectValue placeholder="Select minimum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">{getOfferPercentageLabel('90')}</SelectItem>
                  <SelectItem value="80">{getOfferPercentageLabel('80')}</SelectItem>
                  <SelectItem value="70">{getOfferPercentageLabel('70')}</SelectItem>
                  <SelectItem value="60">{getOfferPercentageLabel('60')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="rent-available"
              checked={formData.isRentAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isRentAvailable: checked })}
              className="h-5 w-5"
            />
            <Label htmlFor="rent-available" className="text-sm cursor-pointer">Also available for rent?</Label>
          </div>
          
          {formData.isRentAvailable && (
            <div className="ml-8 space-y-2">
              <Label className="text-sm font-medium">Daily Rate *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  type="number" 
                  placeholder="2500"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  className="h-10 pl-8 w-full max-w-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Details - Simple Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Vehicle Details</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="insurance-valid"
              checked={formData.insuranceValidTill ? true : false}
              onCheckedChange={(checked) => setFormData({ 
                ...formData, 
                insuranceValidTill: checked ? new Date().toISOString().split('T')[0] : '',
                insuranceType: checked ? 'Comprehensive' : ''
              })}
              className="h-5 w-5"
            />
            <Label htmlFor="insurance-valid" className="text-sm cursor-pointer">Insurance valid</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="service-history"
              checked={formData.lastServiceDate ? true : false}
              onCheckedChange={(checked) => setFormData({ 
                ...formData, 
                lastServiceDate: checked ? new Date().toISOString().split('T')[0] : '',
                authorizedServiceCenter: checked
              })}
              className="h-5 w-5"
            />
            <Label htmlFor="service-history" className="text-sm cursor-pointer">Complete service history</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="rc-transfer"
              checked={formData.rtoTransferSupport}
              onCheckedChange={(checked) => setFormData({ ...formData, rtoTransferSupport: checked })}
              className="h-5 w-5"
            />
            <Label htmlFor="rc-transfer" className="text-sm cursor-pointer">Will help with RC transfer</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="no-accident"
              checked={formData.noAccidentHistory || false}
              onCheckedChange={(checked) => setFormData({ ...formData, noAccidentHistory: checked })}
              className="h-5 w-5"
            />
            <Label htmlFor="no-accident" className="text-sm cursor-pointer">No accident history</Label>
          </div>
        </div>
      </div>

      {/* Key Features - Popular ones only */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Key Features</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="power-steering"
              checked={formData.features?.powerSteering || false}
              onCheckedChange={(checked) => handleFeatureChange('powerSteering', checked as boolean)}
              className="h-5 w-5"
            />
            <Label htmlFor="power-steering" className="text-sm cursor-pointer">Power Steering</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="air-conditioning"
              checked={formData.features?.airConditioning || false}
              onCheckedChange={(checked) => handleFeatureChange('airConditioning', checked as boolean)}
              className="h-5 w-5"
            />
            <Label htmlFor="air-conditioning" className="text-sm cursor-pointer">AC</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="power-windows"
              checked={formData.features?.powerWindows || false}
              onCheckedChange={(checked) => handleFeatureChange('powerWindows', checked as boolean)}
              className="h-5 w-5"
            />
            <Label htmlFor="power-windows" className="text-sm cursor-pointer">Power Windows</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="music-system"
              checked={formData.features?.musicSystem || false}
              onCheckedChange={(checked) => handleFeatureChange('musicSystem', checked as boolean)}
              className="h-5 w-5"
            />
            <Label htmlFor="music-system" className="text-sm cursor-pointer">Music System</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="alloy-wheels"
              checked={formData.features?.alloyWheels || false}
              onCheckedChange={(checked) => handleFeatureChange('alloyWheels', checked as boolean)}
              className="h-5 w-5"
            />
            <Label htmlFor="alloy-wheels" className="text-sm cursor-pointer">Alloy Wheels</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="reverse-camera"
              checked={formData.features?.reverseCamera || false}
              onCheckedChange={(checked) => handleFeatureChange('reverseCamera', checked as boolean)}
              className="h-5 w-5"
            />
            <Label htmlFor="reverse-camera" className="text-sm cursor-pointer">Reverse Camera</Label>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">More features can be added in description</p>
      </div>
    </div>
  );
};

export default PricingStep;
