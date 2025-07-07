
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
      {/* Search Section with improved spacing */}
      <div className="pb-6">
        <SearchFilters onFilterChange={onFilterChange} />
      </div>
      
      {/* Hero Banner with proper spacing */}
      <div className="pb-8">
        <HeroBanner />
      </div>
      
      {/* Filter Tabs with consistent spacing */}
      <div className="pb-5">
        <FilterTabs 
          activeType={currentFilters.type}
          onTypeChange={onTypeChange}
        />
      </div>
    </div>
  );
};

export default HomeHeader;
