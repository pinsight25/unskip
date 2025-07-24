
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft, Car, Package } from 'lucide-react';
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

  // Fetch dealer by slug using React Query
  const { data: dealer, isLoading: dealerLoading, error: dealerError } = useQuery({
    queryKey: ['dealer', dealerSlug],
    queryFn: async () => {
      if (!dealerSlug) throw new Error('No dealer slug provided');
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('slug', dealerSlug)
        .single();
      if (error || !data) throw new Error('Dealer not found');
      return data;
    },
    enabled: !!dealerSlug,
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
        seatingCapacity: car.seating_capacity,
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
            <h1 className="text-2xl font-bold mb-4">Dealer Not Found</h1>
            <p className="text-gray-600 mb-6">The dealer you're looking for doesn't exist.</p>
            <Link to="/dealers">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dealers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  dealer.carsInStock = cars.length;
  dealer.accessoriesInStock = accessories.length;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb - Desktop Only */}
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
        {/* Back Button for Mobile */}
        <div className="md:hidden py-2">
          <Link 
            to="/dealers" 
            className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dealers
          </Link>
        </div>
        {/* Edit Profile Button (only for dealer owner) */}
        {user && dealer.user_id === user.id && (
          <div className="flex justify-end mb-4">
            <Button onClick={() => setEditOpen(true)} variant="outline">Edit Profile</Button>
          </div>
        )}
        {/* Enhanced Dealer Header */}
        <DealerHeader dealer={dealer} />
        
        {/* Inventory Section with Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cars' | 'accessories')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cars" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Cars ({sortedCars.length})
              </TabsTrigger>
              <TabsTrigger value="accessories" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Accessories ({sortedAccessories.length})
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

        {/* Edit Dealer Profile Modal */}
        {user && dealer.user_id === user.id && (
          <EditDealerProfileModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            dealer={dealer}
            onSave={() => {
              setEditOpen(false);
              // Refetch dealer data after save
              if (dealerSlug) {
                supabase
                  .from('dealers')
                  .select('*')
                  .eq('slug', dealerSlug)
                  .single()
                  .then(({ data }) => setDealer(data));
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DealerInventory;
