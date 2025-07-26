
import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DealerHeader from '@/components/dealer/DealerHeader';
import DealerInventoryHeader from '@/components/dealer/DealerInventoryHeader';
import DealerInventoryGrid from '@/components/dealer/DealerInventoryGrid';
import AccessoryCard from '@/components/accessories/AccessoryCard';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { 
  ArrowLeft, 
  Car, 
  Package, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  Plus,
  BarChart3,
  Calendar,
  Target,
  Building,
  User,
  MapPin,
  Tag,
  Award,
  Mail,
  Phone
} from 'lucide-react';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import { useUser } from '@/contexts/UserContext';
import EditDealerProfileModal from '@/components/modals/EditDealerProfileModal';
import { useQuery } from '@tanstack/react-query';
import { useCars } from '@/hooks/queries/useCarQueries';
import { useAccessories } from '@/hooks/queries/useAccessories';

const DealerInventory = () => {
  const { dealerSlug } = useParams();
  const [sortBy, setSortBy] = useState('');
  const [activeTab, setActiveTab] = useState<'cars' | 'accessories'>('cars');
  const { user } = useUser();
  const [editOpen, setEditOpen] = useState(false);
  const location = useLocation();
  
  // Main view toggle for dealer's own page
  const [mainView, setMainView] = useState<'inventory' | 'dashboard'>('inventory');
  
  // Mobile info tab toggle
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'contact' | 'location' | 'brands'>('about');
  
  // Business dashboard tab state
  const [activeBusinessTab, setActiveBusinessTab] = useState<'overview' | 'inventory' | 'analytics' | 'messages'>('overview');

  // Fetch dealer data using React Query
  const { data: dealer, isLoading: dealerLoading, error: dealerError } = useQuery({
    queryKey: ['dealer', dealerSlug, user?.id],
    queryFn: async () => {
      // Check if this is dealer's own page by slug
      if (dealerSlug && user?.id) {
        // First try to fetch by slug to check if it's the user's own dealer page
        const { data: slugData, error: slugError } = await supabase
          .from('dealers')
          .select('*')
          .eq('slug', dealerSlug)
          .single();
        
        if (!slugError && slugData && slugData.user_id === user.id) {
          // This is the dealer's own page accessed via slug
          return slugData;
        }
      }
      
      // Check if this is the dashboard route
      if (!dealerSlug && location.pathname === '/dealer/dashboard') {
        if (!user?.id) throw new Error('User not authenticated');
        const { data, error } = await supabase
          .from('dealers')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (error || !data) throw new Error('Dealer profile not found');
        return data;
      }
      
      // For public dealer inventory, fetch by slug
      if (!dealerSlug) throw new Error('No dealer slug provided');
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('slug', dealerSlug)
        .single();
      if (error || !data) throw new Error('Dealer not found');
      return data;
    },
    enabled: !!dealerSlug || (location.pathname === '/dealer/dashboard' && !!user?.id),
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetch cars for this dealer using React Query
  const { data: cars = [], isLoading: carsLoading } = useQuery({
    queryKey: ['dealer-cars', dealer?.user_id],
    queryFn: async () => {
      if (!dealer?.user_id) return [];
      const { data, error } = await supabase
        .from('cars')
        .select('*, car_images(image_url)')
        .eq('seller_id', dealer.user_id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((car: any) => ({
        id: car.id,
        title: `${car.year} ${car.make} ${car.model}`,
        brand: car.make,
        model: car.model,
        variant: car.variant,
        year: car.year,
        price: car.price,
        images: Array.isArray(car.car_images) ? car.car_images.map((img: any) => img.image_url) : [],
        mileage: car.kilometers_driven || 0,
        kilometersDriven: car.kilometers_driven || 0,
        fuelType: car.fuel_type,
        transmission: car.transmission,
        ownership: car.number_of_owners || 1,
        ownershipNumber: car.number_of_owners || 1,
        location: [car.area, car.city].filter(Boolean).join(', '),
        description: car.description || '',
        seller: {
          id: car.seller_id || '',
          name: dealer.business_name,
          type: 'dealer',
          phone: formatPhoneForAuth(dealer.phone),
          email: dealer.email || '',
          verified: dealer.verification_status === 'verified',
        },
        registrationYear: car.registration_year,
        registrationState: car.registration_state,
        fitnessCertificateValidTill: car.fitness_certificate_valid_till,
        numberOfOwners: car.number_of_owners || 1,
        seatingCapacity: car.seating_capacity || 5,
        color: car.color,
        acceptOffers: car.accept_offers,
        offerPercentage: car.offer_percentage,
        insuranceValidTill: car.insurance_valid_till,
        insuranceType: car.insurance_type,
        lastServiceDate: car.last_service_date,
        serviceAtAuthorized: car.authorized_service_center,
        rtoTransferSupport: car.rto_transfer_support,
        isRentAvailable: car.is_rent_available,
        rentPrice: car.rentPrice,
        rentPolicies: car.rentPolicies,
        rentType: car.rentType,
        verified: car.verified,
        featured: car.featured,
      }));
    },
    enabled: !!dealer?.user_id,
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetch accessories for this dealer using React Query
  const { data: accessories = [], isLoading: accessoriesLoading } = useQuery({
    queryKey: ['dealer-accessories', dealer?.user_id],
    queryFn: async () => {
      if (!dealer?.user_id) return [];
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .eq('seller_id', dealer.user_id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!dealer?.user_id,
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Sorting for cars
  const sortedCars = [...cars].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'year_desc':
        return b.year - a.year;
      case 'mileage_asc':
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  // Sorting for accessories
  const sortedAccessories = [...accessories].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price_min - b.price_min;
      case 'price_desc':
        return b.price_min - a.price_min;
      default:
        return 0;
    }
  });

  // Loading state
  if (dealerLoading || carsLoading || accessoriesLoading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <p className="text-gray-600">Please wait while we load the dealer inventory.</p>
          </div>
        </div>
      </div>
    );
  }

  if (dealerError || !dealer) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
                (dealerSlug && user && dealer?.user_id === user.id)) ? 'Business Dashboard Not Available' : 'Dealer Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
                (dealerSlug && user && dealer?.user_id === user.id))
                ? 'Please complete your dealer registration to access the business dashboard.'
                : 'The dealer you\'re looking for doesn\'t exist.'
              }
            </p>
            <Link to={((!dealerSlug && location.pathname === '/dealer/dashboard') || 
                      (dealerSlug && user && dealer?.user_id === user.id)) ? '/profile' : '/dealers'}>
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
                  (dealerSlug && user && dealer?.user_id === user.id)) ? 'Back to Profile' : 'Back to Dealers'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  dealer.carsInStock = cars.length;
  dealer.accessoriesInStock = accessories.length;

  // Brands logic
  const brands = dealer.brands_deal_with || dealer.brands || [];

  // Check if current user is the dealer owner
  const isDealerOwner = user && dealer.user_id === user.id;

  // Specialization color function
  const getSpecializationColor = (specialization: string) => {
    switch (specialization) {
      case 'Luxury Cars':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Budget Cars':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'Electric':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  // Business analytics data (only for dealer owner) - Different from profile analytics
  const businessStats = [
    {
      icon: <Car className="h-5 w-5 md:h-6 md:w-6 text-green-600" />,
      value: cars.length,
      label: 'Active Cars',
      color: 'text-green-600'
    },
    {
      icon: <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />,
      value: accessories.length,
      label: 'Active Accessories',
      color: 'text-orange-600'
    },
    {
      icon: <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />,
      value: 0, // TODO: Implement performance tracking
      label: 'Performance Score',
      color: 'text-blue-600'
    },
    {
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />,
      value: 0, // TODO: Implement days active tracking
      label: 'Days Active',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb - Desktop Only */}
        {!((!dealerSlug && location.pathname === '/dealer/dashboard') || 
           (dealerSlug && user && dealer?.user_id === user.id)) && (
          <Breadcrumb className="py-3 hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dealers" className="hover:text-primary transition-colors">Dealers</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{dealer.name || dealer.business_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {/* Back Button for Mobile */}
        <div className="md:hidden py-2">
          <Link 
            to={((!dealerSlug && location.pathname === '/dealer/dashboard') || 
                (dealerSlug && user && dealer?.user_id === user.id)) ? '/profile' : '/dealers'} 
            className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
              (dealerSlug && user && dealer?.user_id === user.id)) ? 'Back to Profile' : 'Back to Dealers'}
          </Link>
        </div>
        {/* Main View Toggle - Only for dealer's own page */}
        {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
          (dealerSlug && user && dealer?.user_id === user.id)) && (
          <div className="mb-6">
            <Tabs value={mainView} onValueChange={(value) => setMainView(value as 'inventory' | 'dashboard')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="inventory" 
                  className={`flex items-center gap-2 transition-all duration-200 rounded-md px-4 py-2 ${
                    mainView === 'inventory' 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Car className="h-4 w-4" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className={`flex items-center gap-2 transition-all duration-200 rounded-md px-4 py-2 ${
                    mainView === 'dashboard' 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Business Dashboard
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {/* Enhanced Dealer Header - Only show for inventory view or public dealers */}
        {(!((!dealerSlug && location.pathname === '/dealer/dashboard') || 
           (dealerSlug && user && dealer?.user_id === user.id)) || mainView === 'inventory') && (
          <>
            <DealerHeader dealer={dealer} />
            
            {/* Mobile Toggle Tabs - Only for mobile, below shop image */}
            <div className="md:hidden mt-6">
              <div className="flex gap-3 bg-gray-100 p-2 rounded-lg overflow-x-auto">
                {[
                  { id: 'about', icon: Building },
                  { id: 'contact', icon: User },
                  { id: 'location', icon: MapPin },
                  { id: 'brands', icon: Tag }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveInfoTab(tab.id as 'about' | 'contact' | 'location' | 'brands')}
                      className={`flex items-center justify-center p-3 rounded-md transition-all duration-200 flex-1 min-w-0 ${
                        activeInfoTab === tab.id
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
              
              {/* Mobile Tab Content */}
              <div className="mt-4">
                {activeInfoTab === 'about' && (
                  <Card className="p-4">
                    <div className="flex items-center mb-3">
                      <Building className="h-4 w-4 text-primary mr-2" />
                      <h3 className="font-semibold text-base">About</h3>
                    </div>
                    <div className="space-y-2">
                      {dealer.establishmentYear && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="text-sm">Since {dealer.establishmentYear}</span>
                        </div>
                      )}
                      {dealer.businessCategory && (
                        <div className="flex items-center">
                          <Award className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="text-sm">{dealer.businessCategory}</span>
                        </div>
                      )}
                      {dealer.about && (
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-700">{dealer.about}</span>
                        </div>
                      )}
                      {dealer.specialization && (
                        <div className="mt-3">
                          <Badge className={`${getSpecializationColor(dealer.specialization)} border font-medium text-xs px-2 py-1`}>
                            {dealer.specialization}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                
                {activeInfoTab === 'contact' && (
                  <Card className="p-4">
                    <div className="flex items-center mb-3">
                      <User className="h-4 w-4 text-primary mr-2" />
                      <h3 className="font-semibold text-base">Contact</h3>
                    </div>
                    <div className="space-y-2">
                      {dealer.contactPerson && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="text-sm font-medium">{dealer.contactPerson}</span>
                        </div>
                      )}
                      {dealer.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="text-sm">{dealer.phone}</span>
                        </div>
                      )}
                      {dealer.email && (
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="text-sm">{dealer.email}</span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          className="flex-1 text-sm py-1"
                          onClick={() => {
                            const phoneNumber = dealer.phone || '+919876543210';
                            window.location.href = `tel:${phoneNumber}`;
                          }}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
                
                {activeInfoTab === 'location' && (
                  <Card className="p-4">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      <h3 className="font-semibold text-base">Location & Stock</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2 text-gray-500" />
                        <span className="text-sm">{dealer.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Car className="h-3 w-3 mr-2 text-gray-500" />
                        <span className="text-sm">{dealer.carsInStock} cars in stock</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="h-3 w-3 mr-2 text-gray-500" />
                        <span className="text-sm">{dealer.accessoriesInStock || 0} accessories in stock</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 text-sm py-1"
                          onClick={() => {
                            const encodedLocation = encodeURIComponent(dealer.location);
                            window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
                          }}
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
                
                {activeInfoTab === 'brands' && (
                  <Card className="p-4">
                    <div className="flex items-center mb-3">
                      <Tag className="h-4 w-4 text-primary mr-2" />
                      <h3 className="font-semibold text-base">Brands Available</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {brands.map((brand, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Business Dashboard Section - Only for dealer's own dashboard when dashboard tab is selected */}
        {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
          (dealerSlug && user && dealer?.user_id === user.id)) && mainView === 'dashboard' && (
          <div className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Business Dashboard
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Track performance and manage your business
              </p>
            </div>
            
            {/* Business Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {businessStats.map((stat, index) => (
                <Card key={index} className="p-4 text-center">
                  <div className={`mx-auto mb-2 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                </Card>
              ))}
            </div>
            
            {/* Business Analytics Tabs */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <Tabs value={activeBusinessTab} onValueChange={(value) => setActiveBusinessTab(value as 'overview' | 'inventory' | 'analytics' | 'messages')} className="w-full">
                  <TabsList className="flex w-full gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="overview" 
                      className={`flex items-center gap-2 flex-1 transition-all duration-200 rounded-md px-4 py-2 ${
                        activeBusinessTab === 'overview' 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inventory" 
                      className={`flex items-center gap-2 flex-1 transition-all duration-200 rounded-md px-4 py-2 ${
                        activeBusinessTab === 'inventory' 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      <Car className="h-4 w-4" />
                      <span className="text-sm">Inventory</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className={`flex items-center gap-2 flex-1 transition-all duration-200 rounded-md px-4 py-2 ${
                        activeBusinessTab === 'analytics' 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="messages" 
                      className={`flex items-center gap-2 flex-1 transition-all duration-200 rounded-md px-4 py-2 ${
                        activeBusinessTab === 'messages' 
                          ? 'bg-orange-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">Messages</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Recent Activity
                        </h3>
                        <div className="text-center py-8 text-gray-500">
                          <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No cars posted yet. Start by posting your first car!</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Quick Actions
                        </h3>
                        <div className="space-y-3">
                          <Link to="/sell-car">
                            <Button className="w-full justify-start" variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Post New Car
                            </Button>
                          </Link>
                          <Link to="/post-accessory">
                            <Button className="w-full justify-start" variant="outline">
                              <Package className="h-4 w-4 mr-2" />
                              Post Accessory
                            </Button>
                          </Link>
                          <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inventory">
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-3">Inventory Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Active Cars</h4>
                                <p className="text-2xl font-bold text-green-600">{cars.length}</p>
                              </div>
                              <Car className="h-8 w-8 text-green-600" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Active Accessories</h4>
                                <p className="text-2xl font-bold text-orange-600">{accessories.length}</p>
                              </div>
                              <Package className="h-8 w-8 text-orange-600" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-3">Business Analytics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Performance Score</h4>
                            <div className="text-center">
                              <p className="text-3xl font-bold text-blue-600">85</p>
                              <p className="text-sm text-gray-600">Good</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Response Rate</h4>
                            <div className="text-center">
                              <p className="text-3xl font-bold text-green-600">92%</p>
                              <p className="text-sm text-gray-600">Excellent</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Customer Rating</h4>
                            <div className="text-center">
                              <p className="text-3xl font-bold text-yellow-600">4.8</p>
                              <p className="text-sm text-gray-600">Stars</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="messages">
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-3">Message Management</h3>
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Message management features coming soon...</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Inventory Section with Tabs - Show for public dealers or when inventory tab is selected */}
        {(!((!dealerSlug && location.pathname === '/dealer/dashboard') || 
           (dealerSlug && user && dealer?.user_id === user.id)) || mainView === 'inventory') && (
          <div className="mt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cars' | 'accessories')} className="w-full">
            <TabsList className="flex w-full gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="cars" 
                className={`flex items-center gap-2 flex-1 transition-all duration-200 rounded-md px-4 py-2 ${
                  activeTab === 'cars' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Car className="h-4 w-4" />
                <span className="text-sm">Cars ({sortedCars.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="accessories" 
                className={`flex items-center gap-2 flex-1 transition-all duration-200 rounded-md px-4 py-2 ${
                  activeTab === 'accessories' 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                <Package className="h-4 w-4" />
                <span className="text-sm">Accessories ({sortedAccessories.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* Cars Tab */}
            <TabsContent value="cars" className="space-y-4">
              <DealerInventoryHeader 
                carsCount={sortedCars.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              <div className="mt-4">
                <DealerInventoryGrid cars={sortedCars} />
              </div>
              {/* Load More Button for Cars */}
              {sortedCars.length > 0 && (
                <div className="text-center mt-8 md:mt-12 pb-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Load More Cars
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Accessories Tab */}
            <TabsContent value="accessories" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Accessories ({sortedAccessories.length})
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Latest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {sortedAccessories.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Accessories Available</h3>
                  <p className="text-gray-600">This dealer hasn't posted any accessories yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedAccessories.map((accessory) => (
                    <AccessoryCard
                      key={accessory.id}
                      accessory={accessory}
                      viewMode="grid"
                    />
                  ))}
                </div>
              )}
              
              {/* Load More Button for Accessories */}
              {sortedAccessories.length > 0 && (
                <div className="text-center mt-8 md:mt-12 pb-8">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Load More Accessories
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        )}

        {/* Edit Dealer Profile Modal */}
        {((!dealerSlug && location.pathname === '/dealer/dashboard') || 
          (dealerSlug && user && dealer?.user_id === user.id)) && (
          <EditDealerProfileModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            dealer={dealer}
            onSave={() => {
              setEditOpen(false);
              // React Query will automatically refetch the data
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DealerInventory;
