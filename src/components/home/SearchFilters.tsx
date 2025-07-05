
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <div className="bg-white py-6 lg:py-8 border-b border-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 h-12 text-base font-bold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search
            </Button>
          </div>

          {/* Popular Areas */}
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-700 font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Popular Areas in Chennai
              </span>
              {selectedLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLocation}
                  className="text-primary hover:text-primary/80 font-semibold hover:bg-primary/10 h-8 px-4 text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            {/* Responsive horizontal scrollable pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {popularLocations.map((location) => {
                const isSelected = selectedLocation === location;
                return (
                  <button
                    key={location}
                    onClick={() => handleLocationClick(location)}
                    className={`flex-shrink-0 px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap min-h-[44px] ${
                      isSelected 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 transform scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary border border-gray-200 hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    {location}
                  </button>
                );
              })}
            </div>

            {/* Selected location indicator */}
            {selectedLocation && (
              <div className="flex items-center gap-3 text-sm text-primary bg-primary/5 px-6 py-4 rounded-lg border border-primary/20 max-w-lg">
                <MapPin className="h-5 w-5" />
                <span>Showing cars in: <strong className="text-base">{selectedLocation}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
