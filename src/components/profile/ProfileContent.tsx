import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Car, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReceivedOffersTab from '@/components/profile/ReceivedOffersTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import MyListingsTab from '@/components/profile/MyListingsTab';
import { Accessory, AccessoryCategory } from '@/types/accessory';

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
  // Mock accessories data - properly typed with additional properties for MyListingsTab
  const mockAccessories: (Accessory & { postedDate: string; status: string; type: "accessory" })[] = [
    {
      id: 'acc-1',
      name: 'Premium Seat Covers',
      brand: 'AutoFit',
      category: 'seat-covers' as AccessoryCategory,
      price: { min: 2500, max: 2500 },
      images: ['/placeholder.svg'],
      description: 'Premium quality seat covers for your car',
      features: ['Water resistant', 'Easy to clean', 'Custom fit'],
      compatibility: ['Maruti Swift', 'Hyundai i20'],
      availability: 'in-stock',
      seller: {
        id: 'seller-1',
        name: 'Auto Accessories Store',
        shopName: 'Premium Auto Parts',
        type: 'dealer',
        phone: '+91 9876543210',
        email: 'info@autoparts.com',
        verified: true,
        totalSales: 150,
        memberSince: '2023-01-15',
        location: 'Mumbai, Maharashtra',
        specialization: ['seat-covers', 'floor-mats'],
        brandsCarried: ['AutoFit', 'Elegant'],
        responseTime: '2 hours'
      },
      location: 'Mumbai, Maharashtra',
      views: 23,
      createdAt: '2024-01-10T10:00:00Z',
      featured: false,
      condition: 'new',
      // Additional properties for MyListingsTab compatibility
      postedDate: '3 days ago',
      status: 'active',
      type: 'accessory' as const
    },
    {
      id: 'acc-2',
      name: 'LED Headlight Kit',
      brand: 'BrightAuto',
      category: 'led-lights' as AccessoryCategory,
      price: { min: 4500, max: 4500 },
      images: ['/placeholder.svg'],
      description: 'Bright LED headlight upgrade kit',
      features: ['6000K bright white', 'Easy installation', 'Long lasting'],
      compatibility: ['Universal fit'],
      availability: 'in-stock',
      seller: {
        id: 'seller-2',
        name: 'LED Solutions',
        shopName: 'Bright Auto Solutions',
        type: 'dealer',
        phone: '+91 9876543211',
        email: 'info@ledsolutions.com',
        verified: true,
        totalSales: 200,
        memberSince: '2022-06-20',
        location: 'Mumbai, Maharashtra',
        specialization: ['led-lights'],
        brandsCarried: ['BrightAuto', 'Philips'],
        responseTime: '1 hour'
      },
      location: 'Mumbai, Maharashtra',
      views: 15,
      createdAt: '2024-01-08T14:30:00Z',
      featured: false,
      condition: 'new',
      // Additional properties for MyListingsTab compatibility
      postedDate: '1 week ago',
      status: 'active',
      type: 'accessory' as const
    },
    {
      id: 'acc-3',
      name: 'Dashboard Camera',
      brand: 'SafeDrive',
      category: 'dash-cameras' as AccessoryCategory,
      price: { min: 8000, max: 8000 },
      images: ['/placeholder.svg'],
      description: 'HD dashboard camera with night vision',
      features: ['1080p recording', 'Night vision', 'Loop recording'],
      compatibility: ['Universal fit'],
      availability: 'order',
      seller: {
        id: 'seller-3',
        name: 'Electronics Hub',
        shopName: 'Car Electronics Pro',
        type: 'dealer',
        phone: '+91 9876543212',
        email: 'info@electronhub.com',
        verified: true,
        totalSales: 180,
        memberSince: '2022-08-10',
        location: 'Mumbai, Maharashtra',
        specialization: ['dash-cameras', 'infotainment'],
        brandsCarried: ['SafeDrive', '70mai'],
        responseTime: '3 hours'
      },
      location: 'Mumbai, Maharashtra',
      views: 31,
      createdAt: '2024-01-12T09:15:00Z',
      featured: false,
      condition: 'new',
      // Additional properties for MyListingsTab compatibility
      postedDate: '5 days ago',
      status: 'active',
      type: 'accessory' as const
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

          {/* Quick Actions Card */}
          <Card className="p-6 section-gap">
            <h3 className="text-lg font-semibold mb-4 text-center">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/sell-car">
                <Button className="w-full h-14 text-base font-semibold" size="lg">
                  <Car className="h-5 w-5 mr-3" />
                  Post New Car
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
