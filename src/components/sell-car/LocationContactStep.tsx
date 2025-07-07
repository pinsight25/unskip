
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Location & Contact</h2>
      <div className="space-y-4">
        <div>
          <Label>Area *</Label>
          <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Landmark (Optional)</Label>
          <Input 
            placeholder="Near Landmark Mall, Opposite Metro Station"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Phone Number *</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input 
              type="tel" 
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePhoneVerification}
              disabled={formData.phoneVerified || !formData.phone}
            >
              {formData.phoneVerified ? 'Verified' : 'Verify'}
            </Button>
          </div>
          {formData.phoneVerified && (
            <div className="flex items-center mt-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Phone number verified
            </div>
          )}
        </div>

        <div>
          <Label>Description (Optional)</Label>
          <Textarea 
            placeholder="Tell buyers about your car's condition, service history, etc."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationContactStep;
