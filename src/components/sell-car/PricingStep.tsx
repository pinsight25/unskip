
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, IndianRupee, Calendar, Shield, Wrench, FileText, ChevronDown, Car, Settings } from 'lucide-react';
import { useState } from 'react';

interface PricingStepProps {
  formData: any;
  setFormData: (data: any) => void;
  validatePrice: (price: string) => { valid: boolean; message: string };
}

const PricingStep = ({ formData, setFormData, validatePrice }: PricingStepProps) => {
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(true);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

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
        <h2 className="text-xl font-semibold mb-2">Pricing & Documentation</h2>
        <p className="text-sm text-gray-600">Set your price and provide essential details</p>
      </div>

      {/* Pricing Section - Always Expanded */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <IndianRupee className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Pricing</h3>
        </div>
        
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

          {/* CRITICAL: Accept Offers Feature */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Switch
                checked={formData.acceptOffers}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptOffers: checked })}
              />
              <Label className="text-sm font-medium">Accept offers below asking price?</Label>
            </div>
            <p className="text-xs text-blue-600 mb-3">Enabling this helps you sell faster and attracts more buyers</p>
            
            {formData.acceptOffers && (
              <div className="space-y-2">
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
                <p className="text-xs text-gray-500">Offers below this amount will be automatically declined</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isRentAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isRentAvailable: checked })}
            />
            <Label className="text-sm">Also available for rent</Label>
          </div>
        </div>
      </div>

      {/* Rental Details - Only when rent is enabled */}
      {formData.isRentAvailable && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Rental Details</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg">
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
            <div className="space-y-2">
              <Label className="text-sm font-medium">Security Deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <Input 
                  type="number" 
                  placeholder="5000"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  className="h-10 pl-8"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documentation - Collapsible */}
      <Collapsible open={isDocumentationOpen} onOpenChange={setIsDocumentationOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Documentation</h3>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isDocumentationOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Insurance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Insurance Details</h4>
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
              <Wrench className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Service History</h4>
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
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Registration Transfer</h4>
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
        </CollapsibleContent>
      </Collapsible>

      {/* Car Features - Collapsible */}
      <Collapsible open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Car Features</h3>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.sunroof || false}
                onCheckedChange={(checked) => handleFeatureChange('sunroof', checked as boolean)}
              />
              <Label className="text-sm">Sunroof</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.alloyWheels || false}
                onCheckedChange={(checked) => handleFeatureChange('alloyWheels', checked as boolean)}
              />
              <Label className="text-sm">Alloy Wheels</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.reverseCamera || false}
                onCheckedChange={(checked) => handleFeatureChange('reverseCamera', checked as boolean)}
              />
              <Label className="text-sm">Reverse Camera</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.pushStart || false}
                onCheckedChange={(checked) => handleFeatureChange('pushStart', checked as boolean)}
              />
              <Label className="text-sm">Push Start</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.musicSystem || false}
                onCheckedChange={(checked) => handleFeatureChange('musicSystem', checked as boolean)}
              />
              <Label className="text-sm">Music System</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.powerSteering || false}
                onCheckedChange={(checked) => handleFeatureChange('powerSteering', checked as boolean)}
              />
              <Label className="text-sm">Power Steering</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.powerWindows || false}
                onCheckedChange={(checked) => handleFeatureChange('powerWindows', checked as boolean)}
              />
              <Label className="text-sm">Power Windows</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.features?.airConditioning || false}
                onCheckedChange={(checked) => handleFeatureChange('airConditioning', checked as boolean)}
              />
              <Label className="text-sm">Air Conditioning</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PricingStep;
