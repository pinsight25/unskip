
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReceivedOffersTab from '@/components/profile/ReceivedOffersTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import MyListingsTab from '@/components/profile/MyListingsTab';

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
  // Mock accessories data - in real app this would come from props
  const mockAccessories = [
    {
      id: 'acc-1',
      name: 'Premium Seat Covers',
      brand: 'AutoFit',
      category: 'seat-covers',
      price: { min: 2500, max: 2500 },
      images: ['/placeholder.svg'],
      location: 'Mumbai, Maharashtra',
      views: 23,
      postedDate: '3 days ago',
      status: 'active',
      type: 'accessory'
    },
    {
      id: 'acc-2',
      name: 'LED Headlight Kit',
      brand: 'BrightAuto',
      category: 'led-lights',
      price: { min: 4500, max: 4500 },
      images: ['/placeholder.svg'],
      location: 'Mumbai, Maharashtra',
      views: 15,
      postedDate: '1 week ago',
      status: 'active',
      type: 'accessory'
    },
    {
      id: 'acc-3',
      name: 'Dashboard Camera',
      brand: 'SafeDrive',
      category: 'dash-cameras',
      price: { min: 8000, max: 8000 },
      images: ['/placeholder.svg'],
      location: 'Mumbai, Maharashtra',
      views: 31,
      postedDate: '5 days ago',
      status: 'sold',
      type: 'accessory'
    }
  ];

  // Mock dealer info - in real app this would come from user context
  const dealerInfo = user?.dealerVerified ? {
    businessName: 'Premium Auto Solutions',
    verified: true
  } : null;

  // Calculate updated stats including accessories
  const totalListings = listings.length + mockAccessories.filter(acc => acc.status === 'active').length;
  const updatedStats = {
    ...stats,
    activeListings: totalListings
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
            dealerInfo={dealerInfo}
            onEditProfile={onEditProfile}
            onSignOut={onSignOut}
          />

          {/* Stats Section */}
          <ProfileStats stats={updatedStats} />

          {/* Tabs */}
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 section-gap">
              <TabsTrigger value="listings">
                My Listings ({totalListings})
              </TabsTrigger>
              <TabsTrigger value="offers">
                Received Offers ({updatedStats.totalOffers})
              </TabsTrigger>
            </TabsList>

            {/* My Listings Tab */}
            <TabsContent value="listings">
              <MyListingsTab
                listings={listings}
                accessories={mockAccessories}
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
