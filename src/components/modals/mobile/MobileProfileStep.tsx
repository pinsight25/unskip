import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';

const cities = [
  'Chennai',
  'Mumbai', 
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Kolkata'
];

const genders = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: string;
}

interface MobileProfileStepProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  onCompleteProfile: () => void;
  onCancel: () => void;
  error: string;
  isSaving: boolean;
}

const MobileProfileStep = ({
  profileData,
  setProfileData,
  onCompleteProfile,
  onCancel,
  error,
  isSaving
}: MobileProfileStepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Full Name *</label>
          <Input
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Enter your full name"
            className="h-12"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Gender *</label>
          <Select value={profileData.gender} onValueChange={(value) => setProfileData({ ...profileData, gender: value })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {genders.map((gender) => (
                <SelectItem key={gender.value} value={gender.value} className="hover:bg-gray-50">
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Email (Optional)</label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="your.email@example.com"
            className="h-12"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">City *</label>
          <Select value={profileData.city} onValueChange={(value) => setProfileData({ ...profileData, city: value })}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {cities.map((city) => (
                <SelectItem key={city} value={city} className="hover:bg-gray-50">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="space-y-3">
        <Button 
          onClick={onCompleteProfile} 
          disabled={isSaving || !profileData.name.trim() || !profileData.city || !profileData.gender}
          className="w-full h-12 text-base font-semibold"
        >
          {isSaving ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Complete Profile'
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="w-full h-12 text-base"
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default MobileProfileStep;
