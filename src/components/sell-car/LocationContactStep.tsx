
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { updateFormField, toBoolean } from '@/utils/formHelpers';

interface LocationContactStepProps {
  formData: any;
  setFormData: (data: any) => void;
  handlePhoneVerification: () => void;
}

const LocationContactStep = ({ formData, setFormData, handlePhoneVerification }: LocationContactStepProps) => {
  const { user, isSignedIn } = useUser();
  
  const cities = [
    'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 
    'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore'
  ];

  const getAreasByCity = (city: string) => {
    const areaMap: Record<string, string[]> = {
      'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'Porur', 'Tambaram', 'Chrompet'],
      'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Malad', 'Thane', 'Borivali', 'Kandivali', 'Goregaon'],
      'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Janakpuri', 'Rohini', 'Dwarka', 'Saket'],
      'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'JP Nagar'],
    };
    return areaMap[city] || ['Central Area', 'North Area', 'South Area', 'East Area', 'West Area'];
  };

  const areas = formData.city ? getAreasByCity(formData.city) : [];

  // Pre-fill phone if user is signed in
  const displayPhone = isSignedIn && user?.phone ? user.phone : formData.phone;
  const isPhoneVerified = isSignedIn && user?.phone;

  const handlePhoneVerificationClick = () => {
    handlePhoneVerification();
    // The phoneVerified update will be handled by the parent component using updateFormField
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold mb-2">Location & Contact</h2>
        <p className="text-sm text-gray-600">Where is your car located and how can buyers reach you?</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">City *</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => {
                setFormData({ ...formData, city: value, area: '' }); // Reset area when city changes
              }}
            >
              <SelectTrigger className="h-10 w-full max-w-md">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Area *</Label>
            <Select 
              value={formData.area} 
              onValueChange={(value) => setFormData({ ...formData, area: value })}
              disabled={!formData.city}
            >
              <SelectTrigger className="h-10 w-full max-w-md">
                <SelectValue placeholder={formData.city ? "Select your area" : "Select city first"} />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Landmark (Optional)</Label>
          <Input 
            placeholder="Near Landmark Mall, Opposite Metro Station"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            className="h-10 w-full max-w-md"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Phone Number *</Label>
          <div className="flex items-center space-x-2">
            <Input 
              type="tel" 
              placeholder="+91 9876543210"
              value={displayPhone}
              onChange={(e) => setFormData((prev: any) => updateFormField(prev, 'phone', e.target.value))}
              className="flex-1 h-10 w-full max-w-md"
              disabled={isSignedIn && user?.phone}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFormData((prev: any) => updateFormField(prev, 'phoneVerified', true))}
              disabled={isPhoneVerified || toBoolean(formData.phoneVerified) || !displayPhone}
              className="px-4 py-2"
            >
              {isPhoneVerified || toBoolean(formData.phoneVerified) ? 'Verified' : 'Verify'}
            </Button>
          </div>
          {(isPhoneVerified || toBoolean(formData.phoneVerified)) && (
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
            className="resize-none w-full max-w-lg"
          />
          <p className="text-xs text-gray-500">A good description helps buyers understand your car better</p>
        </div>
      </div>
    </div>
  );
};

export default LocationContactStep;
