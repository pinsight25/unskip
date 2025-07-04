
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Car as CarIcon, Heart, RefreshCw } from 'lucide-react';

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
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto">
        {/* Pull to Refresh (Mobile) */}
        {isMobile && (
          <div className="flex justify-center mb-4 px-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPullToRefresh}
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
              onChange={(e) => onSort(e.target.value)}
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

        {/* Car Grid with proper bottom spacing */}
        {filteredCars.length > 0 ? (
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:px-4 pb-8 md:pb-0">
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
              onClick={() => onFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' })}
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
  );
};

export default HomeResults;
