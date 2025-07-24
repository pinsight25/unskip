
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/components/mobile/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useMemo } from 'react';
import { useCars } from '@/hooks/queries/useCarQueries';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { Skeleton } from '@/components/ui/skeleton';

const SearchSkeleton = () => (
  <div className="flex-1 p-6">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-8 w-32" /> {/* "X Cars Available" */}
      <Skeleton className="h-10 w-40" /> {/* Sort dropdown */}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const Search = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: cars = [], isLoading } = useCars();

  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);

  // Filter logic (in-memory, like Buy page)
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Price filter
      if (car.price < priceRange[0] || car.price > priceRange[1]) return false;
      // Make filter
      if (selectedMake && car.make !== selectedMake) return false;
      // Year filter
      if (selectedYear && String(car.year) !== selectedYear) return false;
      // Fuel type filter
      if (selectedFuel.length > 0 && !selectedFuel.includes(car.fuelType)) return false;
      return true;
    });
  }, [cars, priceRange, selectedMake, selectedYear, selectedFuel]);

  // Makes for dropdown
  const makes = useMemo(() => [...new Set(cars.map(car => car.make))], [cars]);

  // Clear filters handler
  const handleClearFilters = () => {
    setPriceRange([0, 10000000]);
    setSelectedMake('');
    setSelectedYear('');
    setSelectedFuel([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 pt-2">
        <div className="bg-white w-full overflow-hidden">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-6 pt-3">
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

          <div className="mb-2">
            <SearchHeader
              searchQuery={''} // (optional: add search bar support)
              onSearchChange={() => {}}
              selectedMake={selectedMake}
              selectedFuel={selectedFuel}
              selectedYear={selectedYear}
              priceRange={priceRange}
              onClearFilters={handleClearFilters}
              onRemoveMake={() => setSelectedMake('')}
              onRemoveFuel={() => setSelectedFuel([])}
              onRemoveYear={() => setSelectedYear('')}
            />
          </div>

          {/* Desktop Layout */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {/* Filters Sidebar - Desktop Only */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                {/* Filters can be left as is or adapted for real data */}
                <SearchFilters
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedMake={selectedMake}
                  onMakeChange={setSelectedMake}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  selectedFuel={selectedFuel}
                  onFuelToggle={(fuel) => setSelectedFuel(prev => prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel])}
                  onClearFilters={handleClearFilters}
                  makes={makes}
                />
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                <div className="max-w-7xl mx-auto">
                  {/* Mobile Filters - Show only on mobile */}
                  <div className="lg:hidden mb-6">
                    <SearchFilters
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      selectedMake={selectedMake}
                      onMakeChange={setSelectedMake}
                      selectedYear={selectedYear}
                      onYearChange={setSelectedYear}
                      selectedFuel={selectedFuel}
                      onFuelToggle={(fuel) => setSelectedFuel(prev => prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel])}
                      onClearFilters={handleClearFilters}
                      makes={makes}
                    />
                  </div>

                  {/* Results/Empty State */}
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">No cars found</h3>
                      <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                      <Button onClick={handleClearFilters}>Clear All Filters</Button>
                    </div>
                  ) : (
                    <SearchResults
                      cars={filteredCars}
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
