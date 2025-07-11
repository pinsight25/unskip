
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
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
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
  ];

  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
          <Input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Enter your full name"
            className="h-12 rounded-2xl border-2 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Email (Optional)</label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="your.email@example.com"
            className="h-12 rounded-2xl border-2 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">City</label>
          <Select value={profileData.city} onValueChange={(value) => setProfileData({ ...profileData, city: value })}>
            <SelectTrigger className="h-12 rounded-2xl border-2 focus:border-primary">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label>
          <Select value={profileData.gender} onValueChange={(value: 'Male' | 'Female' | 'Other') => setProfileData({ ...profileData, gender: value })}>
            <SelectTrigger className="h-12 rounded-2xl border-2 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-2xl border-2">
          Cancel
        </Button>
        <Button 
          onClick={onCompleteProfile} 
          disabled={!profileData.name.trim() || !profileData.city || !profileData.gender || isSaving}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 font-semibold shadow-lg"
        >
          {isSaving ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Setting up your account...
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
