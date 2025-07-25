
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/CustomInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { useState } from 'react';

const cities = [
  'Chennai',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad'
];

type ProfileData = {
  name: string;
  email: string;
  city: string;
};

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
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cityError, setCityError] = useState('');

  const isValidName = (name: string) => name.trim().length >= 2;
  const isValidEmail = (email: string) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidCity = (city: string) => city && city.trim().length > 0;

  const handleNameBlur = () => {
    if (!isValidName(profileData.name)) setNameError('Name must be at least 2 characters');
    else setNameError('');
  };
  const handleEmailBlur = () => {
    if (!isValidEmail(profileData.email)) setEmailError('Please enter a valid email address');
    else setEmailError('');
  };
  const handleCityBlur = () => {
    if (!isValidCity(profileData.city)) setCityError('Please select your city');
    else setCityError('');
  };

  const isFormValid = isValidName(profileData.name) && isValidEmail(profileData.email) && isValidCity(profileData.city);

  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
          <CustomInput
            id="profile-name"
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            onBlur={handleNameBlur}
            placeholder="Enter your full name"
            className="h-12 rounded-2xl border-2 focus:border-primary"
            aria-label="Full Name"
          />
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>

        <div>
          <label htmlFor="profile-email" className="text-sm font-semibold text-gray-700 block mb-2">Email (Optional)</label>
          <CustomInput
            id="profile-email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            onBlur={handleEmailBlur}
            placeholder="your.email@example.com"
            className="h-12 rounded-2xl border-2 focus:border-primary"
            aria-label="Email"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">City</label>
          <Select value={profileData.city} onValueChange={(value) => setProfileData({ ...profileData, city: value })} onBlur={handleCityBlur}>
            <SelectTrigger className="h-12 rounded-2xl border-2 focus:border-primary">
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
            </SelectContent>
          </Select>
          {cityError && <p className="text-red-500 text-sm mt-1">{cityError}</p>}
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
          disabled={!isFormValid || isSaving}
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
