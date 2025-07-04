
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Car as CarIcon, Heart, RefreshCw, SortAsc } from 'lucide-react';

interface HomeResultsProps {
  filteredCars: Car[];
  savedCars: string[];
  currentFilters: {
    query: string;
    type: 'all' | 'dealer' | 'individual';
  };
  isMobile: boolean;
  isRefreshing: boolean;
  onSort: (sortValue: string) => void;
  onSaveCar: (carId: string) => void;
  onMakeOffer: (car: Car) => void;
  onPullToRefresh: () => void;
  onFilterChange: (filters: any) => void;
}

const HomeResults = ({
  filteredCars,
  savedCars,
  currentFilters,
  isMobile,
  isRefreshing,
  onSort,
  onSaveCar,
  onMakeOffer,
  onPullToRefresh,
  onFilterChange
}: HomeResultsProps) => {
  return (
    <section className="py-6 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Pull to Refresh (Mobile) */}
        {isMobile && (
          <div className="flex justify-center mb-4 px-4">
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

        {/* Results Header - Desktop */}
        <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <CarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {filteredCars.length} Cars Available
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  {currentFilters.type !== 'all' && (
                    <Badge variant="outline" className="text-primary border-primary bg-primary/5">
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
              </div>
            </div>
            {currentFilters.query && (
              <p className="text-gray-600 ml-16">
                Showing results for "<strong>{currentFilters.query}</strong>"
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-gray-500" />
              <select 
                onChange={(e) => onSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="mileage_asc">Mileage: Low to High</option>
              </select>
            </div>
            
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Mobile Results Counter */}
        <div className="md:hidden px-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {filteredCars.length} Cars
              </h2>
              {currentFilters.query && (
                <p className="text-sm text-gray-600 mt-1">
                  Results for "{currentFilters.query}"
                </p>
              )}
            </div>
            {savedCars.length > 0 && (
              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                {savedCars.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Car Grid - PROPER SPACING */}
        {filteredCars.length > 0 ? (
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:px-4 pb-32 md:pb-8">
            {filteredCars.map((car) => (
              isMobile ? (
                <MobileCarCard 
                  key={car.id} 
                  car={car} 
                  onSave={onSaveCar}
                  isSaved={savedCars.includes(car.id)}
                  onMakeOffer={() => onMakeOffer(car)}
                  onChat={() => console.log('Chat with seller')}
                  onTestDrive={() => console.log('Schedule test drive')}
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
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">No cars found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search or filters to find more cars that match your preferences.
            </p>
            <Button 
              variant="outline"
              onClick={() => onFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' })}
              className="h-12 px-6"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More - Desktop */}
        {filteredCars.length > 0 && !isMobile && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="h-12 px-8">
              Load More Cars
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeResults;
