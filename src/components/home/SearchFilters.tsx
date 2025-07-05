
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
  
  const popularLocations = ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR'];

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
    <div className="bg-white py-8 lg:py-12 border-b border-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="flex gap-4 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 text-lg border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-xl transition-all duration-200 hover:shadow-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-12 h-16 text-lg font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search
            </Button>
          </div>

          {/* Popular Areas - Single Row Horizontal Scroll */}
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg text-gray-700 font-semibold flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                Popular Areas in Chennai
              </span>
              {selectedLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLocation}
                  className="text-primary hover:text-primary/80 font-semibold hover:bg-primary/10 h-10 px-5 text-base"
                >
                  <X className="h-5 w-5 mr-2" />
                  Clear
                </Button>
              )}
            </div>
            
            {/* Horizontal scrollable pills */}
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {popularLocations.map((location) => {
                const isSelected = selectedLocation === location;
                return (
                  <button
                    key={location}
                    onClick={() => handleLocationClick(location)}
                    className={`flex-shrink-0 px-8 py-4 text-base font-semibold rounded-full transition-all duration-200 whitespace-nowrap min-h-[56px] min-w-[120px] ${
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
              <div className="flex items-center gap-4 text-base text-primary bg-primary/5 px-8 py-5 rounded-xl border border-primary/20 max-w-lg">
                <MapPin className="h-6 w-6" />
                <span>Showing cars in: <strong className="text-lg">{selectedLocation}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
