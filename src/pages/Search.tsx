
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

        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="lg:w-72 flex-shrink-0">
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

            <div className="flex-1 min-w-0">
              <SearchResults
                cars={filteredCars}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Search;
