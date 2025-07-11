
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, Shield } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    name: string;
    phone: string;
    email: string;
  };
  dealerInfo?: {
    businessName: string;
    verified: boolean;
  } | null;
  onEditProfile: () => void;
  onSignOut: () => void;
}

const ProfileHeader = ({ profile, dealerInfo, onEditProfile, onSignOut }: ProfileHeaderProps) => {
  // Add null check for profile
  if (!profile) {
    return null;
  }

  return (
    <Card className="p-4 md:p-6 section-gap">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        <Avatar className="h-20 w-20 md:h-24 md:w-24">
          <AvatarFallback className="text-xl md:text-2xl">
            {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-bold">{profile.name || 'User'}</h2>
            {dealerInfo?.verified && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                Verified Dealer
              </Badge>
            )}
          </div>
          
          {dealerInfo?.verified && (
            <p className="text-gray-600 mb-2">Owner of {dealerInfo.businessName}</p>
          )}
          
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
