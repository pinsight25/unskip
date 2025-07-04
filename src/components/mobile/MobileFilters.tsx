
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
      {/* Mobile Filter Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Filter Cars</h2>
          {(activeType !== 'all' || selectedLocation) && (
            <Badge variant="outline" className="text-primary border-primary bg-primary/5 font-medium">
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
              className="flex items-center gap-2 min-h-[44px] px-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader className="pb-6">
              <SheetTitle className="flex items-center justify-between">
                <span className="text-xl font-bold">Filter Cars</span>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary/80 font-medium hover:bg-primary/10 min-h-[44px]">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-8 pb-20">
              {/* Seller Type */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
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
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 min-h-[44px] ${
                          isActive 
                            ? 'border-primary bg-primary/5 text-primary shadow-lg' 
                            : 'border-gray-200 hover:border-primary/30 bg-white hover:bg-primary/5 hover:shadow-md'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isActive ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-base">{filter.label}</div>
                          <div className="text-sm text-gray-500">{filter.description}</div>
                        </div>
                        <Badge variant="outline" className={`font-semibold ${
                          isActive ? 'border-primary text-primary bg-primary/5' : 'border-gray-300'
                        }`}>
                          {filter.count}
                        </Badge>
                        {isActive && (
                          <div className="w-4 h-4 bg-primary rounded-full shadow-lg"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
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
                        className={`p-4 text-sm rounded-2xl border-2 transition-all duration-200 font-semibold min-h-[44px] ${
                          isSelected 
                            ? 'border-primary bg-primary text-white shadow-lg' 
                            : 'border-gray-200 hover:border-primary/30 bg-white hover:bg-primary/5 hover:shadow-md'
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
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-3xl shadow-lg">
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearFilters} className="flex-1 min-h-[44px] hover:bg-gray/5">
                  Clear All
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1 bg-primary min-h-[44px] hover:bg-primary/90">
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
