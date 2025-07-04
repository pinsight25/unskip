
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
      <div className="bg-white">
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

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
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

            <SearchResults
              cars={filteredCars}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Search;
