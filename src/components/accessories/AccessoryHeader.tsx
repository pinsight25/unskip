
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { accessoryCategories } from '@/data/accessoryMockData';
import { AccessoryFilters, AccessoryCategory } from '@/types/accessory';

interface AccessoryHeaderProps {
  filters: AccessoryFilters;
  onSearchChange: (search: string) => void;
  onCategoryFilter: (category: AccessoryCategory | 'all') => void;
}

const AccessoryHeader = ({ filters, onSearchChange, onCategoryFilter }: AccessoryHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
        <div className="text-center desktop-header-section">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
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

        {/* Search Bar - Fixed container width with overflow control */}
        <div className="max-w-4xl mx-auto desktop-content-spacing">
          <div className="relative overflow-hidden rounded-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              placeholder="Search accessories by name, brand, or car model..."
              className="pl-12 pr-20 md:pr-24 h-16 md:h-20 text-base md:text-lg border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg transition-colors duration-200 hover:shadow-md w-full focus:outline-none focus:ring-0 focus:ring-offset-0"
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 md:h-16 px-6 md:px-8 flex-shrink-0"
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
              onClick={() => onCategoryFilter(category.id as AccessoryCategory | 'all')}
              className="rounded-full px-4 py-2 min-h-[44px] font-medium transition-all duration-200 hover:scale-105"
            >
              <span className="mr-2 text-base">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessoryHeader;
