
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { mockAccessories, accessoryCategories } from '@/data/accessoryMockData';
import { AccessoryFilters, AccessoryCategory } from '@/types/accessory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AccessoryCard from '@/components/accessories/AccessoryCard';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';

const Accessories = () => {
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

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section - Desktop generous spacing */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
          <div className="desktop-page-container">
            <div className="text-center desktop-header-section">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                Accessories Marketplace
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                Enhance your car with premium accessories
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-12">
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-2">
                  🎉 Beta - Free for Limited Time
                </Badge>
                <Link to="/post-accessory">
                  <Button size="lg" className="font-semibold px-6 shadow-sm">
                    <Plus className="h-5 w-5 mr-2" />
                    Post Your Accessory
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto desktop-content-spacing">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search accessories by name, brand, or car model..."
                  className="pl-12 pr-4 h-16 md:h-20 text-base md:text-lg border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 md:h-16 px-6 md:px-8"
                  onClick={() => {}}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3 pb-4 md:pb-8">
              {accessoryCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={filters.category === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.id as AccessoryCategory | 'all')}
                  className="rounded-full px-4 py-2 min-h-[44px] font-medium transition-all duration-200 hover:scale-105"
                >
                  <span className="mr-2 text-base">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section - Desktop generous spacing */}
        <div className="desktop-page-container">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 desktop-header-section">
            <div className="flex items-center gap-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {filteredAccessories.length} {filteredAccessories.length === 1 ? 'Accessory' : 'Accessories'} Found
              </h2>
              
              {/* View Mode Toggle - Desktop only */}
              <div className="hidden lg:flex items-center border rounded-lg p-1 bg-gray-50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-10 w-10 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-10 w-10 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accessories Grid */}
          <div className={`grid grid-gap-standard ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredAccessories.map((accessory) => (
              <AccessoryCard
                key={accessory.id}
                accessory={accessory}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAccessories.length === 0 && (
            <div className="text-center py-12 md:py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                No accessories found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto text-base md:text-lg">
                Try adjusting your search terms or filters to find what you're looking for
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  priceRange: [0, 20000],
                  carModel: '',
                  location: '',
                  sellerType: 'all',
                  availability: 'all',
                  sortBy: 'relevance'
                })}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Accessories;
