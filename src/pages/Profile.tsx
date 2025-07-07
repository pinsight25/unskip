
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
import { User, Car, Heart, Settings, LogOut, Edit, Trash2, Eye, Clock, TrendingUp, MessageCircle } from 'lucide-react';
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

  const [offers] = useState([
    {
      id: '1',
      carTitle: '2021 Toyota Innova Crysta',
      carPrice: 1800000,
      offerAmount: 1650000,
      status: 'pending',
      timeAgo: '2 hours ago'
    },
    {
      id: '2',
      carTitle: '2022 Mahindra XUV700',
      carPrice: 2200000,
      offerAmount: 2000000,
      status: 'rejected',
      timeAgo: '1 day ago'
    }
  ]);

  const [savedCars] = useState([
    {
      id: '1',
      title: '2023 Tata Nexon EV',
      price: 1400000,
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      title: '2022 MG Hector Plus',
      price: 1650000,
      location: 'Mumbai, Maharashtra'
    }
  ]);

  const stats = {
    totalViews: listings.reduce((sum, listing) => sum + listing.views, 0),
    activeListings: listings.filter(l => l.status === 'active').length,
    totalOffers: offers.length,
    soldCars: listings.filter(l => l.status === 'sold').length
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
    // Simulate delete
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

  const getOfferStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      accepted: 'text-green-600 bg-green-50',
      rejected: 'text-red-600 bg-red-50',
      countered: 'text-blue-600 bg-blue-50'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20 pb-28 md:pb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <Card className="p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24">
                  <AvatarFallback className="text-xl md:text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-xl md:text-2xl font-bold mb-2">{profile.name}</h1>
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

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              <Card className="p-4 text-center">
                <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalOffers}</p>
                <p className="text-sm text-gray-600">Offers Made</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.soldCars}</p>
                <p className="text-sm text-gray-600">Cars Sold</p>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="listings">
                  My Listings ({stats.activeListings})
                </TabsTrigger>
                <TabsTrigger value="offers">
                  My Offers ({stats.totalOffers})
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved Cars ({savedCars.length})
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

              {/* My Offers Tab */}
              <TabsContent value="offers">
                <Card className="p-4 md:p-6">
                  {offers.length > 0 ? (
                    <div className="space-y-4">
                      {offers.map((offer) => (
                        <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{offer.carTitle}</h3>
                              <div className="flex items-center gap-4 mb-2">
                                <div>
                                  <p className="text-sm text-gray-600">Car Price</p>
                                  <p className="font-semibold">{formatPrice(offer.carPrice)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Your Offer</p>
                                  <p className="font-bold text-primary">{formatPrice(offer.offerAmount)}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOfferStatusColor(offer.status)}`}>
                                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                </span>
                                <span className="text-sm text-gray-500">{offer.timeAgo}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline">View Car</Button>
                              {offer.status === 'pending' && (
                                <Button size="sm" variant="outline">Withdraw</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No offers made yet</h3>
                      <p className="text-gray-600 mb-6">Start browsing cars to make your first offer</p>
                      <Button onClick={() => navigate('/search')}>Browse Cars</Button>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Saved Cars Tab */}
              <TabsContent value="saved">
                <Card className="p-4 md:p-6">
                  {savedCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedCars.map((car) => (
                        <div key={car.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                          <h3 className="font-semibold mb-2">{car.title}</h3>
                          <p className="text-primary font-bold text-lg mb-1">{formatPrice(car.price)}</p>
                          <p className="text-gray-600 text-sm mb-3">{car.location}</p>
                          <div className="space-y-2">
                            <Button size="sm" className="w-full">Make Offer</Button>
                            <div className="grid grid-cols-2 gap-2">
                              <Button size="sm" variant="outline">
                                <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                                Remove
                              </Button>
                              <Button size="sm" variant="outline">View</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No saved cars yet</h3>
                      <p className="text-gray-600 mb-6">Start browsing to save cars you like</p>
                      <Button onClick={() => navigate('/search')}>Browse Cars</Button>
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
