import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReceivedOffersTab from '@/components/profile/ReceivedOffersTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import MyListingsTab from '@/components/profile/MyListingsTab';
import { getCarLimit, getAccessoryLimit } from '@/constants/limits';

interface ProfileContentProps {
  user: any;
  listings: any[];
  stats: {
    totalViews: number;
    activeListings: number;
    totalOffers: number;
  };
  onEditProfile: () => void;
  onSignOut: () => void;
  onDeleteListing: (listingId: string, title: string) => void;
}

const ProfileContent = ({
  user,
  listings,
  stats,
  onEditProfile,
  onSignOut,
  onDeleteListing
}: ProfileContentProps) => {
  // Mock data - will be replaced with real data from Supabase
  const userType = 'regular';
  const activeAccessoryListings = 7; // Mock count
  const carLimit = getCarLimit(userType);
  const accessoryLimit = getAccessoryLimit(userType);

  const getCountColor = (current: number, limit: number) => {
    if (current >= limit) return 'text-red-600';
    if (current >= limit - 1) return 'text-orange-600';
    return 'text-gray-900';
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-base md:text-lg text-gray-600">
              Manage your account and track your activity
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-2xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <div>
          {/* Profile Header */}
          <ProfileHeader
            profile={user}
            onEditProfile={onEditProfile}
            onSignOut={onSignOut}
          />

          {/* Stats Section */}
          <ProfileStats stats={stats} />

          {/* Tabs */}
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 section-gap">
              <TabsTrigger value="listings">
                <span className="flex items-center gap-2">
                  My Cars
                  <span className={getCountColor(stats.activeListings, carLimit)}>
                    ({stats.activeListings}/{carLimit})
                  </span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="offers">
                <span className="flex items-center gap-2">
                  Accessories
                  <span className={getCountColor(activeAccessoryListings, accessoryLimit)}>
                    ({activeAccessoryListings}/{accessoryLimit})
                  </span>
                </span>
              </TabsTrigger>
            </TabsList>

            {/* My Listings Tab */}
            <TabsContent value="listings">
              <MyListingsTab
                listings={listings}
                onDeleteListing={onDeleteListing}
              />
            </TabsContent>

            {/* Received Offers Tab */}
            <TabsContent value="offers">
              <ReceivedOffersTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
