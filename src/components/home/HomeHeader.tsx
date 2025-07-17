
import SearchFilters from '@/components/home/SearchFilters';
import HeroBanner from '@/components/home/HeroBanner';
import FilterTabs from '@/components/home/FilterTabs';
import CompactSearchHeader from '@/components/home/CompactSearchHeader';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

interface HomeHeaderProps {
  currentFilters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  onTypeChange: (type: 'all' | 'dealer' | 'individual') => void;
  isSearching?: boolean;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
  resultCount?: number;
  allCarsCount: number;
  dealersCount: number;
  ownerCarsCount: number;
}

const HomeHeader = ({ 
  currentFilters, 
  onFilterChange, 
  onTypeChange, 
  isSearching = false,
  searchQuery = '',
  onSearch,
  onClearSearch,
  resultCount = 0,
  allCarsCount,
  dealersCount,
  ownerCarsCount
}: HomeHeaderProps) => {
  if (isSearching && onSearch && onClearSearch) {
    return (
      <CompactSearchHeader 
        query={searchQuery}
        onSearch={onSearch}
        onClear={onClearSearch}
        resultCount={resultCount}
      />
    );
  }

  return (
    <div className="bg-white">
      {/* Search Section */}
      <div className="pb-6">
        <SearchFilters 
          onFilterChange={onFilterChange} 
          onSearch={onSearch}
          hideContent={isSearching}
        />
      </div>
      
      {/* Hero Banner - Hidden during search */}
      {!isSearching && (
        <div className="pb-8">
          <HeroBanner />
        </div>
      )}
      
      {/* Filter Tabs - Hidden during search */}
      {!isSearching && (
        <div className="pb-5">
          <FilterTabs 
            activeType={currentFilters.type}
            onTypeChange={onTypeChange}
            allCarsCount={allCarsCount}
            dealersCount={dealersCount}
            ownerCarsCount={ownerCarsCount}
          />
        </div>
      )}
    </div>
  );
};

export default HomeHeader;
