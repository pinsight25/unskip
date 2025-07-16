
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import DealerHeader from '@/components/dealer/DealerHeader';
import DealerInventoryHeader from '@/components/dealer/DealerInventoryHeader';
import DealerInventoryGrid from '@/components/dealer/DealerInventoryGrid';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';

const DealerInventory = () => {
  const { dealerId } = useParams();
  const [sortBy, setSortBy] = useState('');
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find dealer by ID or slug (from DB, not mock)
  const [dealer, setDealer] = useState<any>(null);

  useEffect(() => {
    const fetchDealerAndCars = async () => {
      setLoading(true);
      setError(null);
      // Fetch dealer by slug or id
      let dealerData = null;
      if (dealerId) {
        const { data, error } = await supabase
          .from('dealers')
          .select('*')
          .or(`id.eq.${dealerId},slug.eq.${dealerId}`)
          .single();
        if (error || !data) {
          setDealer(null);
          setCars([]);
          setError('Dealer not found');
          setLoading(false);
          return;
        }
        dealerData = data;
        setDealer(dealerData);
      }
      // Fetch cars for this dealer (by user_id)
      if (dealerData) {
        const { data: carsData, error: carsError } = await supabase
          .from('cars')
          .select('*')
          .eq('seller_id', dealerData.user_id)
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        if (carsError) {
          setError('Failed to load cars');
          setCars([]);
        } else {
          setCars((carsData || []).map((car: any) => ({
            id: car.id,
            title: `${car.year} ${car.make} ${car.model}`,
            brand: car.make,
            model: car.model,
            variant: car.variant,
            year: car.year,
            price: car.price,
            images: car.images || [], // TODO: fetch car_images if needed
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
              name: dealerData.business_name,
              type: 'dealer',
              phone: formatPhoneForAuth(dealerData.phone),
              email: dealerData.email || '',
              verified: dealerData.verification_status === 'verified',
            },
            registrationYear: car.registration_year,
            registrationState: car.registration_state,
            noAccidentHistory: car.no_accident_history,
            acceptOffers: car.accept_offers,
            offerPercentage: car.offer_percentage,
            insuranceValid: car.insurance_valid,
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
          })));
        }
      }
      setLoading(false);
    };
    fetchDealerAndCars();
  }, [dealerId]);

  // Sorting
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

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading dealer inventory...</div>;
  }
  if (error || !dealer) {
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
        {/* Enhanced Dealer Header */}
        <DealerHeader dealer={dealer} />
        {/* Inventory Section */}
        <div className="mt-6">
          <DealerInventoryHeader 
            carsCount={sortedCars.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <div className="mt-4">
            <DealerInventoryGrid cars={sortedCars} />
          </div>
        </div>
        {/* Load More Button */}
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
      </div>
    </div>
  );
};

export default DealerInventory;
