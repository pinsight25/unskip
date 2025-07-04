
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
    <>
      {/* Compact Header Flow - No Grey Space */}
      <section>
        <SearchFilters onFilterChange={onFilterChange} />
        <HeroBanner />
      </section>

      {/* Filter Tabs */}
      <FilterTabs 
        activeType={currentFilters.type}
        onTypeChange={onTypeChange}
      />
    </>
  );
};

export default HomeHeader;
