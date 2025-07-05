
import { useState, useMemo } from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { mockAccessories, accessoryCategories } from '@/data/accessoryMockData';
import { AccessoryFilters, AccessoryCategory } from '@/types/accessory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AccessoryCard from '@/components/accessories/AccessoryCard';
import { Search, Filter, Grid, List } from 'lucide-react';

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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Accessories Marketplace
              </h1>
              <p className="text-gray-600 text-lg">
                Enhance your car with premium accessories
              </p>
              <Badge className="mt-2 bg-amber-500/10 text-amber-600 border-amber-500/20">
                🎉 Beta - Free for Limited Time
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search accessories by name or car model..."
                  className="pl-10 h-12 text-base"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {accessoryCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={filters.category === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.id as AccessoryCategory | 'all')}
                  className="rounded-full"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto px-4 py-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                {filteredAccessories.length} accessories found
              </p>
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accessories Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
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
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No accessories found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
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
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Accessories;
