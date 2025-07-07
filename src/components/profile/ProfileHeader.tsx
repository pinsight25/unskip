
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    name: string;
    phone: string;
    email: string;
  };
  onEditProfile: () => void;
  onSignOut: () => void;
}

const ProfileHeader = ({ profile, onEditProfile, onSignOut }: ProfileHeaderProps) => {
  return (
    <Card className="p-4 md:p-6 section-gap">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        <Avatar className="h-20 w-20 md:h-24 md:w-24">
          <AvatarFallback className="text-xl md:text-2xl">
            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{profile.name}</h2>
          <p className="text-gray-600 mb-4">Member since March 2024</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEditProfile}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
