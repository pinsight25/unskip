
import SearchFilters from '@/components/home/SearchFilters';
import HeroBanner from '@/components/home/HeroBanner';
import FilterTabs from '@/components/home/FilterTabs';

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
}

const HomeHeader = ({ currentFilters, onFilterChange, onTypeChange }: HomeHeaderProps) => {
  return (
    <div className="bg-white">
      {/* Search Section - No padding issues */}
      <SearchFilters onFilterChange={onFilterChange} />
      
      {/* Hero Banner - Proper spacing */}
      <HeroBanner />
      
      {/* Filter Tabs - Fixed positioning */}
      <FilterTabs 
        activeType={currentFilters.type}
        onTypeChange={onTypeChange}
      />
    </div>
  );
};

export default HomeHeader;
