
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Car, Package, Store, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ReceivedOffersTab from '@/components/profile/ReceivedOffersTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import MyListingsTab from '@/components/profile/MyListingsTab';
import DealerRegistrationPrompt from '@/components/profile/DealerRegistrationPrompt';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import EditDealerProfileModal from '@/components/modals/EditDealerProfileModal';

interface ProfileContentProps {
  user?: any;
  listings: any[];
  accessories?: any[];
  stats?: {
    totalViews: number;
    activeListings: number;
    totalOffers: number;
  };
  isLoading?: boolean;
  isRefetching?: boolean;
  error?: string | null;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  onDeleteListing?: (listingId: string, title: string) => void;
}

const ProfileContent = ({
  user = null,
  listings,
  accessories = [],
  isLoading = false,
  isRefetching = false,
  error = null,
  onEditProfile = () => {},
  onSignOut = () => {},
  onDeleteListing = () => {},
}: ProfileContentProps) => {
  // Fetch dealer info if user is a dealer
  const { data: dealerInfo, refetch: refetchDealerInfo } = useQuery({
    queryKey: ['dealer-info', user?.id, user?.userType, user?.dealer_registration_completed],
    queryFn: async () => {
      // Additional safety checks
      if (!user?.id || user?.userType !== 'dealer' || !user?.dealer_registration_completed) {
        return null;
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(user.id)) {
        return null;
      }
      
      // Check authentication state
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        return null;
      }
      
      if (session.user.id !== user.id) {
        return null;
      }
      
      try {
        const { data, error } = await supabase
          .from('dealers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          return null;
        }
        
        return data;
      } catch (err) {
        return null;
      }
    },
    enabled: !!user?.id && user?.userType === 'dealer' && user?.dealer_registration_completed,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache for long
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Force refetch dealer info when user context changes
  useEffect(() => {
    if (user?.id && user?.userType === 'dealer' && user?.dealer_registration_completed) {
      refetchDealerInfo();
    }
  }, [user?.id, user?.userType, user?.dealer_registration_completed, refetchDealerInfo]);

  // Debug logging for dealer info
  useEffect(() => {
    if (dealerInfo?.slug) {
      
    }
  }, [dealerInfo?.slug]);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'listings' | 'offers'>('listings');
  const [isEditDealerModalOpen, setIsEditDealerModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch received offers for the current user (as seller)
  const { data: receivedOffers = [], refetch } = useQuery({
    queryKey: ['received-offers', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*, car:cars(*), buyer:users!buyer_id(*)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          return [];
        }
        
        return data || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes - match global config
    refetchOnMount: false, // Use global config
    refetchOnWindowFocus: false, // Use global config
    refetchInterval: 120000, // Refetch every 2 minutes as fallback
  });

  // Set active tab based on URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'received-offers') {
      setActiveTab('offers');
    }
  }, [location.search]);

  // Calculate stats
  const stats = {
    totalViews: 0, // TODO: Implement view tracking
    activeCarListings: listings.filter(car => car.status === 'active').length,
    activeAccessoryListings: accessories.filter(acc => acc.status === 'active').length,
    offersReceived: receivedOffers.length,
  };

  const activeListings = listings.filter(car => car.status === 'active');
  const activeAccessories = accessories.filter(a => a.status === 'active');
  const totalActive = activeListings.length + activeAccessories.length;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 xl:px-8 py-6 md:py-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-600">
              Manage your account and track your activity
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 xl:px-8 py-6 md:py-8 pb-20 md:pb-24">
        <div className="space-y-6 md:space-y-8">
          {/* Profile Header */}
          <ProfileHeader
            profile={user}
            dealerInfo={dealerInfo}
            onEditProfile={onEditProfile}
            onSignOut={onSignOut}
            onEditDealerProfile={() => setIsEditDealerModalOpen(true)}
          />

          {/* Stats Section */}
          <ProfileStats stats={stats} />

          {/* Dealer Registration Prompt */}
          <DealerRegistrationPrompt 
            userType={user?.userType} 
            dealerRegistrationCompleted={user?.dealer_registration_completed} 
          />

          {/* Quick Actions Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-center text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/sell-car">
                <Button className="w-full h-14 text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" size="lg">
                  <Car className="h-5 w-5 mr-3" />
                  Post Your Car
                </Button>
              </Link>
              <Link to="/post-accessory">
                <Button className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" size="lg">
                  <Package className="h-5 w-5 mr-3" />
                  Post Accessory
                </Button>
              </Link>
            </div>
            
            {/* Business Dashboard Link - Only for completed dealers */}
            {user?.userType === 'dealer' && user?.dealer_registration_completed && dealerInfo?.slug && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to={`/dealer/${dealerInfo.slug}`}>
                  <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" size="lg">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Business Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Tabs */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'listings' | 'offers')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="listings" className="text-sm md:text-base font-medium">
                  My Listings ({totalActive})
                </TabsTrigger>
                <TabsTrigger value="offers" className="text-sm md:text-base font-medium">
                  Received Offers ({receivedOffers.length})
                </TabsTrigger>
              </TabsList>

              {/* My Listings Tab */}
              <TabsContent value="listings">
                <MyListingsTab />
              </TabsContent>

              {/* Received Offers Tab */}
              <TabsContent value="offers">
                <ReceivedOffersTab offers={receivedOffers} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Edit Dealer Profile Modal */}
      {user?.userType === 'dealer' && dealerInfo && (
        <EditDealerProfileModal
          isOpen={isEditDealerModalOpen}
          onClose={() => setIsEditDealerModalOpen(false)}
          dealer={dealerInfo}
          onSave={() => {
            setIsEditDealerModalOpen(false);
            // Refetch dealer info
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default ProfileContent;
