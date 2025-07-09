
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockAccessories } from '@/data/accessoryMockData';
import { AccessoryFilters, AccessoryCategory } from '@/types/accessory';
import AccessoryHeader from '@/components/accessories/AccessoryHeader';
import AccessoryFiltersComponent from '@/components/accessories/AccessoryFilters';
import AccessoryResults from '@/components/accessories/AccessoryResults';

const Accessories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.state?.from || document.referrer;

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

  const filteredAccessories = useMemo(() => {
    let filtered = mockAccessories;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(accessory =>
        accessory.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        accessory.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        accessory.compatibility.some(model => 
          model.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(accessory => accessory.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(accessory => 
      accessory.price.min >= filters.priceRange[0] && 
      accessory.price.max <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price.min - b.price.min);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.max - a.price.max);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Relevance - featured first, then by views
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.views - a.views;
        });
    }

    return filtered;
  }, [filters]);

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
        {/* Back Button - Show conditionally */}
        {showBackButton && (
          <div className="max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 pt-6">
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
        )}

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
          filteredCount={filteredAccessories.length}
        />

        {/* Results Grid */}
        <AccessoryResults
          accessories={filteredAccessories}
          viewMode={viewMode}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default Accessories;
