
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Car as CarIcon, Heart, RefreshCw, SortAsc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';

interface HomeResultsProps {
  filteredCars: Car[];
  savedCars: string[];
  currentFilters: {
    query: string;
    type: 'all' | 'dealer' | 'individual';
  };
  isMobile: boolean;
  isRefreshing: boolean;
  offerStatuses: Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>;
  onSort: (sortValue: string) => void;
  onSaveCar: (carId: string) => void;
  onMakeOffer: (car: Car) => void;
  onPullToRefresh: () => void;
  onFilterChange: (filters: any) => void;
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

const HomeResults = ({
  filteredCars,
  savedCars,
  currentFilters,
  isMobile,
  isRefreshing,
  offerStatuses,
  onSort,
  onSaveCar,
  onMakeOffer,
  onPullToRefresh,
  onFilterChange,
  getOfferStatus
}: HomeResultsProps) => {
  const { navigateToChat } = useChatManager();
  const { toast } = useToast();

  const handleChatClick = (car: Car) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (status === 'accepted') {
      navigateToChat(car.id);
    }
  };

  const handleTestDriveClick = (car: Car) => {
    toast({
      title: "Test Drive Request",
      description: `Test drive request sent for ${car.title}`,
    });
    console.log('Test drive requested for car:', car.id);
  };

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Mobile Pull to Refresh */}
        {isMobile && (
          <div className="flex justify-center mb-6 px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPullToRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 min-h-[44px]"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </Button>
          </div>
        )}

        {/* Desktop Results Header */}
        <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {filteredCars.length} Cars Available
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  {currentFilters.type !== 'all' && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-[14px] px-3 py-1.5 font-medium">
                      {currentFilters.type === 'dealer' ? 'Dealers Only' : 'Individual Owners'}
                    </Badge>
                  )}
                  {savedCars.length > 0 && (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 text-[14px] px-3 py-1.5 font-medium">
                      <Heart className="h-4 w-4 mr-1 fill-current" />
                      {savedCars.length} saved
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {currentFilters.query && (
              <p className="text-gray-600 ml-20 text-[14px]">
                Showing results for "<strong>{currentFilters.query}</strong>"
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <SortAsc className="h-5 w-5 text-gray-500" />
              <select 
                onChange={(e) => onSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-w-[180px]"
              >
                <option value="">Sort by Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="mileage_asc">Mileage: Low to High</option>
              </select>
            </div>
            
            <Button variant="outline" size="default" className="h-11 px-5 text-[14px] font-medium border-gray-300 hover:border-orange-500 hover:text-orange-500">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Mobile Results Counter */}
        <div className="md:hidden px-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredCars.length} Cars
              </h2>
              {currentFilters.query && (
                <p className="text-[14px] text-gray-600 mt-1">
                  Results for "{currentFilters.query}"
                </p>
              )}
            </div>
            {savedCars.length > 0 && (
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                <Heart className="h-4 w-4 mr-1 fill-current" />
                {savedCars.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Optimized Car Grid */}
        {filteredCars.length > 0 ? (
          <div className="md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 pb-20 md:pb-8">
            {filteredCars.map((car) => (
              isMobile ? (
                <MobileCarCard 
                  key={car.id} 
                  car={car} 
                  onSave={onSaveCar}
                  isSaved={savedCars.includes(car.id)}
                  onMakeOffer={() => onMakeOffer(car)}
                  onChat={() => handleChatClick(car)}
                  onTestDrive={() => handleTestDriveClick(car)}
                  offerStatus={getOfferStatus(car.id)}
                />
              ) : (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  onSave={onSaveCar}
                  isSaved={savedCars.includes(car.id)}
                />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">No cars found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-[16px] leading-relaxed">
              Try adjusting your search or filters to find more cars that match your preferences.
            </p>
            <Button 
              variant="outline"
              size="default"
              onClick={() => onFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' })}
              className="h-12 px-8 text-[15px] font-medium"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More - Desktop */}
        {filteredCars.length > 0 && !isMobile && (
          <div className="text-center mt-12">
            <Button variant="outline" size="default" className="h-12 px-12 text-[15px] font-medium">
              Load More Cars
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeResults;
