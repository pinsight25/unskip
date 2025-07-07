
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Grid, List } from 'lucide-react';
import { AccessoryFilters } from '@/types/accessory';

interface AccessoryFiltersProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  filters: AccessoryFilters;
  onSortChange: (sortBy: AccessoryFilters['sortBy']) => void;
  filteredCount: number;
}

const AccessoryFiltersComponent = ({ 
  viewMode, 
  setViewMode, 
  filters, 
  onSortChange, 
  filteredCount 
}: AccessoryFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 desktop-header-section">
      <div className="flex items-center gap-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {filteredCount} {filteredCount === 1 ? 'Accessory' : 'Accessories'} Found
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
        
        <Select value={filters.sortBy} onValueChange={onSortChange}>
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
  );
};

export default AccessoryFiltersComponent;
