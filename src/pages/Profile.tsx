
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditProfileModal from '@/components/modals/EditProfileModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { User, Car, Settings, LogOut, Edit, Trash2, Eye, Clock } from 'lucide-react';
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
    activeListings: listings.filter(l => l.status === 'active').length
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
          <div className="max-width-container py-6 lg:py-8">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-sm md:text-base text-gray-600">
                Manage your account and track your activity
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-width-container py-6 lg:py-8 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
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
                      onClick={() => setIsEditProfileOpen(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsSignOutModalOpen(true)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Simplified Stats Section */}
            <div className="grid grid-cols-2 gap-4 section-gap">
              <Card className="p-4 text-center">
                <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalViews}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </Card>
              <Card className="p-4 text-center">
                <Car className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.activeListings}</p>
                <p className="text-sm text-gray-600">Active Listings</p>
              </Card>
            </div>

            {/* Simplified Tabs */}
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-1 section-gap">
                <TabsTrigger value="listings">
                  My Listings ({stats.activeListings})
                </TabsTrigger>
              </TabsList>

              {/* My Listings Tab */}
              <TabsContent value="listings">
                <Card className="p-4 md:p-6">
                  {listings.length > 0 ? (
                    <div className="space-y-4">
                      {listings.map((listing) => (
                        <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg">{listing.title}</h3>
                                {getStatusBadge(listing.status)}
                              </div>
                              <p className="text-primary font-bold text-xl mb-1">
                                {formatPrice(listing.price)}
                              </p>
                              <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {listing.postedDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {listing.views} views
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-row md:flex-col gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => navigate(`/sell?edit=${listing.id}`)}
                                className="flex-1 md:flex-none"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteListing(listing.id, listing.title)}
                                className="flex-1 md:flex-none text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                      <p className="text-gray-600 mb-6">Post your first car to get started</p>
                      <Button onClick={() => navigate('/sell')}>
                        <Car className="h-4 w-4 mr-2" />
                        Post Your Car
                      </Button>
                    </div>
                  )}
                </Card>
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
