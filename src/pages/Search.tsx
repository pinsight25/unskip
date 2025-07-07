
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { mockCars } from '@/data/mockData';
import { useCarSearch } from '@/hooks/useCarSearch';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';

const Search = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredCars,
    priceRange,
    setPriceRange,
    selectedMake,
    setSelectedMake,
    selectedFuel,
    handleFuelToggle,
    selectedYear,
    setSelectedYear,
    sortBy,
    setSortBy,
    clearFilters
  } = useCarSearch(mockCars);

  const makes = [...new Set(mockCars.map(car => car.brand))];

  return (
    <ResponsiveLayout>
      <div className="bg-white w-full overflow-hidden">
        <div className="mb-4">
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMake={selectedMake}
            selectedFuel={selectedFuel}
            selectedYear={selectedYear}
            priceRange={priceRange}
            onClearFilters={clearFilters}
            onRemoveMake={() => setSelectedMake('')}
            onRemoveFuel={handleFuelToggle}
            onRemoveYear={() => setSelectedYear('')}
          />
        </div>

        {/* Desktop Layout */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <SearchFilters
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedMake={selectedMake}
                  onMakeChange={setSelectedMake}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  selectedFuel={selectedFuel}
                  onFuelToggle={handleFuelToggle}
                  onClearFilters={clearFilters}
                  makes={makes}
                />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
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
                  onFuelToggle={handleFuelToggle}
                  onClearFilters={clearFilters}
                  makes={makes}
                />
              </div>

              <SearchResults
                cars={filteredCars}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </main>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Search;
