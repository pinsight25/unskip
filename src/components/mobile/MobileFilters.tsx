
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X, Car, Building2, Users } from 'lucide-react';

interface MobileFiltersProps {
  activeType: 'all' | 'dealer' | 'individual';
  onTypeChange: (type: 'all' | 'dealer' | 'individual') => void;
  onFilterChange: (filters: any) => void;
}

const MobileFilters = ({ activeType, onTypeChange, onFilterChange }: MobileFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterTypes = [
    { key: 'all' as const, label: 'All Cars', icon: Car, count: '2.3k+' },
    { key: 'dealer' as const, label: 'Dealers', icon: Building2, count: '850+' },
    { key: 'individual' as const, label: 'Private', icon: Users, count: '1.5k+' }
  ];

  const handleTypeChange = (type: 'all' | 'dealer' | 'individual') => {
    onTypeChange(type);
    onFilterChange({
      query: '',
      type,
      priceRange: [0, 5000000],
      location: ''
    });
  };

  const clearFilters = () => {
    onTypeChange('all');
    onFilterChange({
      query: '',
      type: 'all',
      priceRange: [0, 5000000],
      location: ''
    });
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Horizontal scrollable filter pills */}
      <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => handleTypeChange(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{filter.label}</span>
                <Badge variant="outline" className={`text-xs ml-1 ${
                  isActive ? 'border-white/30 text-white/90' : 'border-gray-300'
                }`}>
                  {filter.count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Filter button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="ml-2 flex items-center gap-2 whitespace-nowrap"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Filters
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Seller Type */}
              <div>
                <h3 className="font-semibold mb-3">Seller Type</h3>
                <div className="grid grid-cols-1 gap-2">
                  {filterTypes.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeType === filter.key;
                    return (
                      <button
                        key={filter.key}
                        onClick={() => handleTypeChange(filter.key)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isActive 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{filter.label}</div>
                          <div className="text-sm text-gray-500">{filter.count}</div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Under ₹2L',
                    '₹2L-5L', 
                    '₹5L-10L',
                    '₹10L-20L',
                    '₹20L-50L',
                    'Above ₹50L'
                  ].map((range) => (
                    <button
                      key={range}
                      className="p-3 text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR'].map((location) => (
                    <button
                      key={location}
                      className="p-3 text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Clear All
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1 bg-primary">
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileFilters;
