
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessories } from '@/hooks/queries/useAccessories';
import { AccessoryFilters, AccessoryCategory } from '@/types/accessory';
import AccessoryHeader from '@/components/accessories/AccessoryHeader';
import AccessoryFiltersComponent from '@/components/accessories/AccessoryFilters';
import AccessoryResults from '@/components/accessories/AccessoryResults';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

const Accessories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState<AccessoryFilters>({
    search: '',
    category: 'all',
    priceRange: [0, 20000],
    carModel: '',
    location: '',
    sellerType: 'all',
    availability: 'all',
    sortBy: 'relevance'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Convert filters to database query format
  const dbFilters = {
    search: filters.search || undefined,
    category: filters.category !== 'all' ? filters.category : undefined,
    // Only pass price filters if both min and max are meaningful
    ...(filters.priceRange[0] > 0 && filters.priceRange[1] > 0 ? {
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1]
    } : {}),
    location: filters.location || undefined,
  };

  const { data: accessories = [], isLoading, error } = useAccessories(dbFilters);
  
  // Add real-time refetch for accessories
  useRealtimeRefetch('accessories', ['accessories']);

  const handleCategoryFilter = (category: AccessoryCategory | 'all') => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleSortChange = (sortBy: AccessoryFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: [0, 20000],
      carModel: '',
      location: '',
      sellerType: 'all',
      availability: 'all',
      sortBy: 'relevance'
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-white">
        <AccessoryHeader
          filters={filters}
          onSearchChange={handleSearchChange}
          onCategoryFilter={handleCategoryFilter}
        />
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
        {/* Controls Bar */}
        <AccessoryFiltersComponent
          viewMode={viewMode}
          setViewMode={setViewMode}
          filters={filters}
          onSortChange={handleSortChange}
          filteredCount={accessories.length}
        />

        {/* Results Grid */}
        <AccessoryResults
          accessories={accessories}
          viewMode={viewMode}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Accessories;
