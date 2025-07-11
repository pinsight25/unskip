
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
  gender: 'Male' | 'Female' | 'Other'; // Fix: Match the exact enum values from useOTPAuth
}

interface ProfileCompletionStepProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  onCompleteProfile: () => void;
  onCancel: () => void;
  error: string;
  isSaving: boolean;
}

const ProfileCompletionStep = ({
  profileData,
  setProfileData,
  onCompleteProfile,
  onCancel,
  error,
  isSaving
}: ProfileCompletionStepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Full Name *</label>
          <Input
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Enter your full name"
            className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Gender *</label>
          <Select value={profileData.gender} onValueChange={(value: 'Male' | 'Female' | 'Other') => setProfileData({ ...profileData, gender: value })}>
            <SelectTrigger className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary">
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
            className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">City *</label>
          <Select value={profileData.city} onValueChange={(value) => setProfileData({ ...profileData, city: value })}>
            <SelectTrigger className="h-12 rounded-xl border-2 border-gray-100 focus:border-primary">
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
          <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-2xl border-2" disabled={isSaving}>
          Cancel
        </Button>
        <Button 
          onClick={onCompleteProfile} 
          disabled={isSaving || !profileData.name.trim() || !profileData.city || !profileData.gender}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
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
      </div>
    </>
  );
};

export default ProfileCompletionStep;
