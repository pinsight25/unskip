import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import SearchFilters from '@/components/home/SearchFilters';
import HeroBanner from '@/components/home/HeroBanner';
import FilterTabs from '@/components/home/FilterTabs';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import MobileOfferModal from '@/components/modals/MobileOfferModal';
import MobileOTPModal from '@/components/modals/MobileOTPModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Car as CarIcon, Heart, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

const Home = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    type: 'all',
    priceRange: [0, 5000000],
    location: ''
  });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilterChange = (filters: SearchFiltersType) => {
    setCurrentFilters(filters);
    applyFilters(filters);
  };

  const applyFilters = (filters: SearchFiltersType) => {
    let filtered = cars;
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(car => car.seller.type === filters.type);
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredCars(filtered);
  };

  const handleTypeFilter = (type: 'all' | 'dealer' | 'individual') => {
    const newFilters = { ...currentFilters, type };
    setCurrentFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSort = (sortValue: string) => {
    const sorted = [...filteredCars].sort((a, b) => {
      switch (sortValue) {
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
    setFilteredCars(sorted);
  };

  const handleSaveCar = (carId: string) => {
    setSavedCars(prev => {
      const isAlreadySaved = prev.includes(carId);
      if (isAlreadySaved) {
        toast({
          title: "Car removed from wishlist",
          description: "Car has been removed from your saved cars.",
        });
        return prev.filter(id => id !== carId);
      } else {
        toast({
          title: "Car saved to wishlist",
          description: "Car has been added to your saved cars.",
        });
        return [...prev, carId];
      }
    });
  };

  const handleMakeOffer = (car: Car) => {
    setSelectedCar(car);
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleOTPSuccess = () => {
    setIsVerified(true);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
    toast({
      title: "Offer submitted!",
      description: "Your offer has been sent to the seller.",
    });
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Updated!",
        description: "Car listings have been refreshed.",
      });
    }, 1000);
  };

  // Sort by featured and verified first by default
  useEffect(() => {
    const sorted = [...cars].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });
    setCars(sorted);
    setFilteredCars(sorted);
  }, []);

  return (
    <div className="bg-background pb-4 md:pb-0">
      {/* Hero Section */}
      <section className="pt-14 md:pt-16">
        <SearchFilters onFilterChange={handleFilterChange} />
        <HeroBanner />
      </section>

      {/* Filter Tabs */}
      <FilterTabs 
        activeType={currentFilters.type}
        onTypeChange={handleTypeFilter}
      />

      {/* Results Section */}
      <section className="py-6 md:py-12 bg-white">
        <div className="container mx-auto">
          {/* Pull to Refresh (Mobile) */}
          {isMobile && (
            <div className="flex justify-center mb-4 px-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePullToRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
              </Button>
            </div>
          )}

          {/* Results Header - Desktop Only */}
          <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <CarIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  {filteredCars.length} Cars Available
                </h2>
                {currentFilters.type !== 'all' && (
                  <Badge variant="outline" className="text-primary border-primary">
                    {currentFilters.type === 'dealer' ? 'Dealers' : 'Individual Owners'}
                  </Badge>
                )}
                {savedCars.length > 0 && (
                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                    <Heart className="h-3 w-3 mr-1 fill-current" />
                    {savedCars.length} saved
                  </Badge>
                )}
              </div>
              {currentFilters.query && (
                <p className="text-muted-foreground">
                  Showing results for "{currentFilters.query}"
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                onChange={(e) => handleSort(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm bg-background hover:bg-muted/50 transition-colors"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="mileage_asc">Mileage: Low to High</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Mobile Results Counter */}
          <div className="md:hidden px-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {filteredCars.length} Cars
              </h2>
              {savedCars.length > 0 && (
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                  <Heart className="h-3 w-3 mr-1 fill-current" />
                  {savedCars.length} saved
                </Badge>
              )}
            </div>
          </div>

          {/* Car Grid - Improved responsive layout */}
          {filteredCars.length > 0 ? (
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:px-4">
              {filteredCars.map((car) => (
                isMobile ? (
                  <MobileCarCard 
                    key={car.id} 
                    car={car} 
                    onSave={handleSaveCar}
                    isSaved={savedCars.includes(car.id)}
                    onMakeOffer={() => handleMakeOffer(car)}
                    onChat={() => console.log('Chat with seller')}
                    onTestDrive={() => console.log('Schedule test drive')}
                  />
                ) : (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    onSave={handleSaveCar}
                    isSaved={savedCars.includes(car.id)}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more cars.
              </p>
              <Button 
                variant="outline"
                onClick={() => handleFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' })}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More - Desktop Only */}
          {filteredCars.length > 0 && !isMobile && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Cars
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedCar && (
        <>
          {isMobile ? (
            <>
              <MobileOfferModal
                isOpen={showOfferModal}
                onClose={() => setShowOfferModal(false)}
                car={selectedCar}
                onSubmit={handleOfferSubmit}
              />
              <MobileOTPModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onSuccess={handleOTPSuccess}
                phoneNumber="+91 98765 43210"
                purpose="make an offer"
              />
            </>
          ) : (
            <>
              <OfferModal
                isOpen={showOfferModal}
                onClose={() => setShowOfferModal(false)}
                car={selectedCar}
                onSubmit={handleOfferSubmit}
              />
              <OTPModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onSuccess={handleOTPSuccess}
                phoneNumber="+91 98765 43210"
                purpose="make an offer"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
