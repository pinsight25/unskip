
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/mobile/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

const Search = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  useRealtimeRefetch('cars', ['cars']);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          car_images!inner (image_url, is_cover)
        `)
        .eq('status', 'active')
        .eq('car_images.is_cover', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      // Fetch seller info for each car
      const carsWithSellers = await Promise.all(
        (data || []).map(async (car) => {
          let sellerInfo = null;
          if (car.seller_id) {
            try {
              const { data: sellerData, error: sellerError } = await supabase
                .from('users')
                .select('name, created_at, phone, email, is_verified')
                .eq('id', car.seller_id)
                .single();

              if (!sellerError && sellerData) {
                sellerInfo = sellerData;
              }
            } catch (error) {
              // console.log('Could not fetch seller info for car:', car.id);
            }
          }

          return {
            id: car.id,
            title: `${car.year} ${car.make} ${car.model}`,
            brand: car.make,
            make: car.make,
            model: car.model,
            variant: car.variant,
            year: car.year,
            price: car.price,
            images: car.car_images && car.car_images.length > 0 ? car.car_images.map(img => img.image_url) : ['/placeholder-car.jpg'],
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
              name: sellerInfo?.name || 'Individual Seller',
              type: 'individual' as const,
              phone: sellerInfo?.phone || '',
              email: sellerInfo?.email || '',
              verified: sellerInfo?.is_verified || car.verified || false,
              rating: 0,
              totalSales: 0,
              memberSince: sellerInfo?.created_at ? 
                new Date(sellerInfo.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                }) : 'N/A',
              avatar: '',
              businessName: '',
              location: [car.area, car.city].filter(Boolean).join(', '),
            },
            color: car.color,
            landmark: car.landmark,
            seatingCapacity: car.seating_capacity,
            isRentAvailable: car.is_rent_available || false,
            rentPrice: car.daily_rate ? { daily: car.daily_rate, weekly: car.weekly_rate || 0 } : undefined,
            rentPolicies: undefined,
            verified: car.verified === true || sellerInfo?.is_verified === true || false,
            featured: car.featured === true || false,
            views: car.views || 0,
            createdAt: car.created_at,
            registrationYear: car.registration_year,
            registrationState: car.registration_state,
            fitnessCertificateValidTill: car.fitness_certificate_valid_till,
            noAccidentHistory: car.no_accident_history,
            acceptOffers: car.accept_offers,
            offerPercentage: car.offer_percentage,
            insuranceValid: car.insurance_valid,
            insuranceValidTill: car.insurance_valid_till,
            insuranceType: car.insurance_type,
            lastServiceDate: car.last_service_date,
            serviceCenterType: car.service_center_type,
            serviceAtAuthorized: car.authorized_service_center,
            rtoTransferSupport: car.rto_transfer_support,
            insurance: undefined,
            serviceHistory: undefined,
          };
        })
      );
      
      setCars(carsWithSellers);
    } catch (error) {
      // console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const makes = [...new Set(cars.map(car => car.make))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 responsive-header-spacing">
        <div className="bg-white w-full overflow-hidden">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="mb-4">
            <SearchHeader
              searchQuery={''}
              onSearchChange={() => {}}
              selectedMake={''}
              selectedFuel={[]}
              selectedYear={''}
              priceRange={[0, 5000000]}
              onClearFilters={() => {}}
              onRemoveMake={() => {}}
              onRemoveFuel={() => {}}
              onRemoveYear={() => {}}
            />
          </div>

          {/* Desktop Layout */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {/* Filters Sidebar - Desktop Only */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                {/* Filters can be left as is or adapted for real data */}
                <SearchFilters
                  priceRange={[0, 5000000]}
                  onPriceRangeChange={() => {}}
                  selectedMake={''}
                  onMakeChange={() => {}}
                  selectedYear={''}
                  onYearChange={() => {}}
                  selectedFuel={[]}
                  onFuelToggle={() => {}}
                  onClearFilters={() => {}}
                  makes={makes}
                />
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                <div className="max-w-7xl mx-auto">
                  {/* Mobile Filters - Show only on mobile */}
                  <div className="lg:hidden mb-6">
                    <SearchFilters
                      priceRange={[0, 5000000]}
                      onPriceRangeChange={() => {}}
                      selectedMake={''}
                      onMakeChange={() => {}}
                      selectedYear={''}
                      onYearChange={() => {}}
                      selectedFuel={[]}
                      onFuelToggle={() => {}}
                      onClearFilters={() => {}}
                      makes={makes}
                    />
                  </div>

                  {/* Loading/Empty States */}
                  {loading ? (
                    <div className="text-center py-12">Loading cars...</div>
                  ) : cars.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">No cars found</h3>
                      <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                      <Button onClick={() => window.location.reload()}>Clear All Filters</Button>
                    </div>
                  ) : (
                    <SearchResults
                      cars={cars}
                      sortBy={''}
                      onSortChange={() => {}}
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </main>
      {isMobile && <div className="h-16" />}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Search;
