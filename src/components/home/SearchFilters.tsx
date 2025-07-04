
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
        <div className="space-y-5 max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="flex gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-border focus:border-primary bg-white shadow-sm rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-primary px-6 h-12 text-base font-medium hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search
            </Button>
          </div>

          {/* Popular Locations - Redesigned */}
          <div className="space-y-3">
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
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {popularLocations.map((location) => {
                const isSelected = selectedLocation === location;
                return (
                  <Badge 
                    key={location}
                    className={`cursor-pointer transition-all duration-200 px-3 py-2 font-medium rounded-xl text-center justify-center hover:shadow-md ${
                      isSelected 
                        ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                    onClick={() => handleLocationClick(location)}
                  >
                    {location}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
