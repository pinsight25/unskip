
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, X } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  onSearch?: (query: string) => void;
  hideContent?: boolean;
}

interface SearchFilters {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

const SearchFilters = ({ onFilterChange, onSearch, hideContent = false }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  const popularLocations = ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR', 'Tambaram', 'Chromepet'];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      onFilterChange({
        query: searchQuery,
        type: 'all',
        priceRange: [0, 5000000],
        location: selectedLocation
      });
    }
  };

  const handleLocationClick = (location: string) => {
    const newLocation = selectedLocation === location ? '' : location;
    setSelectedLocation(newLocation);
    setSearchQuery(newLocation);
    
    if (onSearch) {
      onSearch(newLocation);
    } else {
      onFilterChange({
        query: newLocation,
        type: 'all',
        priceRange: [0, 5000000],
        location: newLocation
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedLocation('');
    if (onSearch) {
      onSearch('');
    } else {
      onFilterChange({
        query: '',
        type: 'all',
        priceRange: [0, 5000000],
        location: ''
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="space-y-4 lg:space-y-5">
          {/* Search Bar */}
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-11 lg:h-12 text-base border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch}
              size="default"
              className="px-6 lg:px-8 h-11 lg:h-12 text-base font-bold"
            >
              Search
            </Button>
          </div>

          {/* Popular Areas - Mobile horizontal scroll, Desktop wrapped */}
          {!hideContent && (
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center justify-center sm:justify-start max-w-5xl mx-auto">
                <span className="text-sm lg:text-base text-gray-700 font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  Popular Areas in Chennai
                </span>
              </div>
              
              {/* Mobile: Horizontal scroll container */}
              <div className="max-w-5xl mx-auto lg:hidden">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {popularLocations.map((location) => {
                    const isSelected = selectedLocation === location;
                    return (
                      <button
                        key={location}
                        onClick={() => handleLocationClick(location)}
                        className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap min-h-[40px] ${
                          isSelected 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 transform scale-105' 
                            : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white hover:shadow-md'
                        }`}
                      >
                        {location}
                      </button>
                    );
                  })}
                  {/* Extra padding at the end for better UX */}
                  <div className="w-4 flex-shrink-0" />
                </div>
              </div>

              {/* Desktop: Wrapped layout */}
              <div className="max-w-5xl mx-auto hidden lg:block">
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start pb-2">
                  {popularLocations.map((location) => {
                    const isSelected = selectedLocation === location;
                    return (
                      <button
                        key={location}
                        onClick={() => handleLocationClick(location)}
                        className={`flex-shrink-0 px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap min-h-[44px] ${
                          isSelected 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 transform scale-105' 
                            : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white hover:shadow-md'
                        }`}
                      >
                        {location}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedLocation && (
                <div className="flex items-center gap-3 text-sm text-primary bg-primary/5 px-4 lg:px-6 py-3 lg:py-4 rounded-lg border border-primary/20 max-w-lg mx-auto sm:mx-0">
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span>Showing cars in: <strong className="text-base">{selectedLocation}</strong></span>
                  <button
                    onClick={clearSearch}
                    className="ml-auto text-primary hover:text-primary/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
