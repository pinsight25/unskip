
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditProfileModal from '@/components/modals/EditProfileModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import ReceivedOffersTab from '@/components/profile/ReceivedOffersTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import MyListingsTab from '@/components/profile/MyListingsTab';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com'
  });

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    listingId: string | null;
    title: string;
  }>({
    isOpen: false,
    listingId: null,
    title: ''
  });

  // Mock data
  const [listings] = useState([
    {
      id: '1',
      title: '2022 Maruti Swift VXI',
      price: 650000,
      location: 'Mumbai, Maharashtra',
      views: 45,
      postedDate: '2 days ago',
      status: 'active'
    },
    {
      id: '2',
      title: '2021 Hyundai i20 Sportz',
      price: 750000,
      location: 'Mumbai, Maharashtra',
      views: 32,
      postedDate: '5 days ago',
      status: 'active'
    },
    {
      id: '3',
      title: '2020 Honda City VX',
      price: 950000,
      location: 'Mumbai, Maharashtra',
      views: 28,
      postedDate: '1 week ago',
      status: 'sold'
    }
  ]);

  const stats = {
    totalViews: listings.reduce((sum, listing) => sum + listing.views, 0),
    activeListings: listings.filter(l => l.status === 'active').length,
    totalOffers: 4 // Mock number of received offers
  };

  const handleEditProfile = (newProfile: typeof profile) => {
    setProfile(newProfile);
  };

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
    navigate('/');
  };

  const handleDeleteListing = (listingId: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      listingId,
      title
    });
  };

  const confirmDeleteListing = () => {
    setTimeout(() => {
      setDeleteModal({ isOpen: false, listingId: null, title: '' });
      toast({
        title: "Listing Deleted",
        description: "Your listing has been deleted successfully",
      });
    }, 1000);
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-sm md:text-base text-gray-600">
                Manage your account and track your activity
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onSignOut={() => setIsSignOutModalOpen(true)}
            />

            {/* Stats Section */}
            <ProfileStats stats={stats} />

            {/* Tabs */}
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 section-gap">
                <TabsTrigger value="listings">
                  My Listings ({stats.activeListings})
                </TabsTrigger>
                <TabsTrigger value="offers">
                  Received Offers ({stats.totalOffers})
                </TabsTrigger>
              </TabsList>

              {/* My Listings Tab */}
              <TabsContent value="listings">
                <MyListingsTab
                  listings={listings}
                  onDeleteListing={handleDeleteListing}
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

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentProfile={profile}
        onSave={handleEditProfile}
      />

      <DeleteConfirmModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listingId: null, title: '' })}
        onConfirm={confirmDeleteListing}
        title="Delete Listing"
        description={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />
    </ResponsiveLayout>
  );
};

export default Profile;
