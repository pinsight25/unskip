
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X, Car, Building2, Users, MapPin } from 'lucide-react';

interface MobileFiltersProps {
  activeType: 'all' | 'dealer' | 'individual';
  onTypeChange: (type: 'all' | 'dealer' | 'individual') => void;
  onFilterChange: (filters: any) => void;
}

const MobileFilters = ({ activeType, onTypeChange, onFilterChange }: MobileFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const filterTypes = [
    { 
      key: 'all' as const, 
      label: 'All Cars', 
      icon: Car, 
      count: '2.3k+',
      description: 'Browse all available cars'
    },
    { 
      key: 'dealer' as const, 
      label: 'Dealers', 
      icon: Building2, 
      count: '850+',
      description: 'Certified dealer cars'
    },
    { 
      key: 'individual' as const, 
      label: 'Owner Cars', 
      icon: Users, 
      count: '1.5k+',
      description: 'Direct from owners'
    }
  ];

  const locations = ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR', 'Tambaram', 'Chromepet'];

  const handleTypeChange = (type: 'all' | 'dealer' | 'individual') => {
    onTypeChange(type);
    onFilterChange({
      query: '',
      type,
      priceRange: [0, 5000000],
      location: selectedLocation
    });
  };

  const handleLocationChange = (location: string) => {
    const newLocation = selectedLocation === location ? '' : location;
    setSelectedLocation(newLocation);
    onFilterChange({
      query: newLocation,
      type: activeType,
      priceRange: [0, 5000000],
      location: newLocation
    });
  };

  const clearFilters = () => {
    onTypeChange('all');
    setSelectedLocation('');
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
      {/* Horizontal scrollable filter pills - Hidden on mobile, using sheet instead */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Filter Cars</h2>
          {(activeType !== 'all' || selectedLocation) && (
            <Badge variant="outline" className="text-primary border-primary">
              {activeType !== 'all' ? filterTypes.find(f => f.key === activeType)?.label : ''} 
              {selectedLocation && (activeType !== 'all' ? ` • ${selectedLocation}` : selectedLocation)}
            </Badge>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader className="pb-6">
              <SheetTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">Filter Cars</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-8 pb-20">
              {/* Seller Type */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Seller Type
                </h3>
                <div className="space-y-3">
                  {filterTypes.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeType === filter.key;
                    return (
                      <button
                        key={filter.key}
                        onClick={() => handleTypeChange(filter.key)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                          isActive 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{filter.label}</div>
                          <div className="text-sm text-gray-500">{filter.description}</div>
                        </div>
                        <Badge variant="outline" className={`${
                          isActive ? 'border-primary text-primary' : 'border-gray-300'
                        }`}>
                          {filter.count}
                        </Badge>
                        {isActive && (
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {locations.map((location) => {
                    const isSelected = selectedLocation === location;
                    return (
                      <button
                        key={location}
                        onClick={() => handleLocationChange(location)}
                        className={`p-3 text-sm rounded-xl border-2 transition-all duration-200 font-medium ${
                          isSelected 
                            ? 'border-primary bg-primary text-white' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {location}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-3xl">
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
