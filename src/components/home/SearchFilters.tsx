
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  const popularLocations = ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR', 'Tambaram', 'Chromepet'];

  const handleSearch = () => {
    onFilterChange({
      query: searchQuery,
      type: 'all',
      priceRange: [0, 5000000],
      location: selectedLocation
    });
  };

  const handleLocationClick = (location: string) => {
    const newLocation = selectedLocation === location ? '' : location;
    setSelectedLocation(newLocation);
    setSearchQuery(newLocation);
    onFilterChange({
      query: newLocation,
      type: 'all',
      priceRange: [0, 5000000],
      location: newLocation
    });
  };

  const clearLocation = () => {
    setSelectedLocation('');
    setSearchQuery('');
    onFilterChange({
      query: '',
      type: 'all',
      priceRange: [0, 5000000],
      location: ''
    });
  };

  return (
    <div className="bg-white py-2 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="space-y-3 max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="flex gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 text-base border-2 border-border focus:border-primary bg-white shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-primary px-6 h-11 text-base font-medium hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search
            </Button>
          </div>

          {/* Horizontal Location Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Popular Areas
              </span>
              {selectedLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLocation}
                  className="text-primary hover:text-primary/80 font-medium hover:bg-primary/10 transition-all duration-200 h-8 px-3"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            {/* Horizontal Scrollable Pills */}
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 scroll-smooth">
                {popularLocations.map((location) => {
                  const isSelected = selectedLocation === location;
                  return (
                    <button
                      key={location}
                      onClick={() => handleLocationClick(location)}
                      className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                        isSelected 
                          ? 'bg-primary text-white shadow-md hover:bg-primary/90' 
                          : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary border border-gray-200 hover:border-primary/30'
                      }`}
                    >
                      {location}
                      {isSelected && <X className="h-3 w-3 ml-1" />}
                    </button>
                  );
                })}
              </div>
              
              {/* Fade edges for scroll indication */}
              <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
            </div>

            {/* Selected Location Indicator */}
            {selectedLocation && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 px-3 py-2 rounded-lg border border-primary/20">
                <MapPin className="h-4 w-4" />
                <span>Showing cars in: <strong>{selectedLocation}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
