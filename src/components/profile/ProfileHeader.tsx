
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, LogOut, Shield, Clock, Store } from 'lucide-react';

interface ProfileHeaderProps {
  profile?: {
    name?: string;
    phone?: string;
    email?: string;
    userType?: 'regular' | 'premium' | 'dealer';
    dealer_registration_completed?: boolean;
  };
  dealerInfo?: any;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  onEditDealerProfile?: () => void;
}

const ProfileHeader = ({ profile, dealerInfo, onEditProfile, onSignOut, onEditDealerProfile }: ProfileHeaderProps) => {
  if (!profile) {
    return null;
  }

  const isDealer = profile?.userType === 'dealer';

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <Avatar className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
          <AvatarFallback className="text-xl md:text-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700">
            {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{profile.name || 'User'}</h2>
            
            {/* Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              {isDealer && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs md:text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Dealer Account
                </Badge>
              )}
              {isDealer && !profile.dealer_registration_completed && (
                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs md:text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Registration Incomplete
                </Badge>
              )}
              {dealerInfo?.verified && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs md:text-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Dealer
                </Badge>
              )}
              {dealerInfo?.pending && !dealerInfo?.verified && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs md:text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Verification
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600">
              Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditProfile}
              className="flex items-center justify-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
            
            {isDealer && dealerInfo && onEditDealerProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditDealerProfile}
                className="flex items-center justify-center gap-2"
              >
                <Store className="h-4 w-4" />
                Edit Dealer Profile
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
