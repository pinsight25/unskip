
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, X } from 'lucide-react';

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
    <div className="bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="flex gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-border focus:border-primary bg-white shadow-sm rounded-xl transition-all duration-200 hover:shadow-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-primary px-6 h-12 text-base font-medium hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px]"
            >
              Search
            </Button>
          </div>

          {/* Popular Locations - REDESIGNED NO SCROLL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <MapPin className="h-4 w-4" />
                <span>Popular Locations:</span>
              </div>
              {selectedLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLocation}
                  className="text-primary hover:text-primary/80 font-medium hover:bg-primary/10 transition-all duration-200 min-h-[44px] px-3"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            {/* Modern Grid Layout - NO HORIZONTAL SCROLL */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {popularLocations.map((location) => {
                const isSelected = selectedLocation === location;
                return (
                  <Button
                    key={location}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLocationClick(location)}
                    className={`h-auto py-3 px-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[44px] border-2 ${
                      isSelected 
                        ? 'bg-primary text-white border-primary shadow-lg scale-105 hover:bg-primary/90' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    {location}
                  </Button>
                );
              })}
            </div>

            {/* Selected Location Indicator */}
            {selectedLocation && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/20">
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
