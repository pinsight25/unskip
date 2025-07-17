
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ReceivedOffersTab from '@/components/profile/ReceivedOffersTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import MyListingsTab from '@/components/profile/MyListingsTab';

interface ProfileContentProps {
  user: any;
  listings: any[];
  accessories: any[];
  stats: {
    totalViews: number;
    activeListings: number;
    totalOffers: number;
  };
  isLoading: boolean;
  isRefetching?: boolean;
  error: string | null;
  onEditProfile: () => void;
  onSignOut: () => void;
  onDeleteListing: (listingId: string, title: string) => void;
  refetch: () => void; // Add refetch as required prop
}

const ProfileContent = ({
  user,
  listings,
  accessories,
  stats,
  isLoading,
  isRefetching,
  error,
  onEditProfile,
  onSignOut,
  onDeleteListing,
  refetch // Destructure refetch
}: ProfileContentProps) => {
  // Remove dealerInfo fetching and just set to null
  const dealerInfo = null;

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'listings' | 'offers'>('listings');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'received-offers' || tab === 'offers') {
      setActiveTab('offers');
    } else {
      setActiveTab('listings');
    }
  }, [location.search]);

  // Calculate total active listings
  const activeListings = listings.filter(l => l.status === 'active');
  const activeAccessories = accessories.filter(a => a.status === 'active');
  const totalActive = activeListings.length + activeAccessories.length;

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
          <ProfileStats stats={stats} />

          {/* Quick Actions Card */}
          <Card className="p-6 section-gap">
            <h3 className="text-lg font-semibold mb-4 text-center">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/sell-car">
                <Button className="w-full h-14 text-base font-semibold" size="lg">
                  <Car className="h-5 w-5 mr-3" />
                  Post Your Car
                </Button>
              </Link>
              <Link to="/post-accessory">
                <Button variant="outline" className="w-full h-14 text-base font-semibold" size="lg">
                  <Package className="h-5 w-5 mr-3" />
                  Post Accessory
                </Button>
              </Link>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'listings' | 'offers')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 section-gap">
              <TabsTrigger value="listings">
                My Listings ({totalActive})
              </TabsTrigger>
              <TabsTrigger value="offers">
                Received Offers ({stats.totalOffers})
              </TabsTrigger>
            </TabsList>

            {/* My Listings Tab */}
            <TabsContent value="listings">
              <MyListingsTab />
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
