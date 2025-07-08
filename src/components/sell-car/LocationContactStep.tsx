
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface LocationContactStepProps {
  formData: any;
  setFormData: (data: any) => void;
  handlePhoneVerification: () => void;
}

const LocationContactStep = ({ formData, setFormData, handlePhoneVerification }: LocationContactStepProps) => {
  const areas = ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'Porur', 'Tambaram', 'Chrompet'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-2">Location & Contact</h2>
        <p className="text-sm text-gray-600">Where is your car located and how can buyers reach you?</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Area *</Label>
            <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select your area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Landmark (Optional)</Label>
            <Input 
              placeholder="Near Landmark Mall, Opposite Metro Station"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Phone Number *</Label>
          <div className="flex items-center space-x-2">
            <Input 
              type="tel" 
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="flex-1 h-10"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePhoneVerification}
              disabled={formData.phoneVerified || !formData.phone}
              className="px-4 py-2"
            >
              {formData.phoneVerified ? 'Verified' : 'Verify'}
            </Button>
          </div>
          {formData.phoneVerified && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Phone number verified</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Description (Optional)</Label>
          <Textarea 
            placeholder="Tell buyers about your car's condition, service history, recent maintenance, etc."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">A good description helps buyers understand your car better</p>
        </div>
      </div>
    </div>
  );
};

export default LocationContactStep;
