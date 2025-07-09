
import { MapPin, Phone, MessageCircle, Shield, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellCarFormData } from '@/types/car';
import { updateFormField } from '@/utils/formHelpers';

interface LocationContactStepProps {
  formData: SellCarFormData;
  onUpdate: (updates: Partial<SellCarFormData>) => void;
}

const cities = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const LocationContactStep = ({ formData, onUpdate }: LocationContactStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Location & Contact</h2>
        <p className="text-gray-600">Where is your car located and how can buyers reach you?</p>
      </div>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={(value) => onUpdate({ city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="area">Area/Locality *</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => onUpdate({ area: e.target.value })}
                placeholder="e.g., Andheri West, Koramangala"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder="Complete address for inspection (optional)"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerName">Your Name *</Label>
              <Input
                id="sellerName"
                value={formData.sellerName}
                onChange={(e) => onUpdate({ sellerName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="Enter your email (optional)"
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => onUpdate({ additionalInfo: e.target.value })}
              placeholder="Any additional details about the car or sale conditions..."
              rows={3}
            />
          </div>

          {/* Contact Preferences */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-base font-medium">Contact Preferences</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsappContact"
                checked={formData.whatsappContact}
                onCheckedChange={(checked) => onUpdate(updateFormField({}, 'whatsappContact', checked))}
              />
              <Label htmlFor="whatsappContact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Allow WhatsApp contact
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verifiedSeller"
                checked={formData.verifiedSeller}
                onCheckedChange={(checked) => onUpdate(updateFormField({}, 'verifiedSeller', checked))}
              />
              <Label htmlFor="verifiedSeller" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Request seller verification badge
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationContactStep;
