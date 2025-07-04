
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';

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
  
  const handleSearch = () => {
    onFilterChange({
      query: searchQuery,
      type: 'all',
      priceRange: [0, 5000000],
      location: ''
    });
  };

  const handleLocationClick = (location: string) => {
    setSearchQuery(location);
    onFilterChange({
      query: location,
      type: 'all',
      priceRange: [0, 5000000],
      location: ''
    });
  };

  return (
    <div className="bg-white py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="flex gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-border focus:border-primary bg-white shadow-sm rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              className="bg-primary px-6 h-12 text-base font-medium hover:bg-primary/90 text-white rounded-lg"
            >
              Search
            </Button>
          </div>

          {/* Popular Locations */}
          <div className="overflow-x-auto">
            <div className="flex items-center gap-3 min-w-max">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium whitespace-nowrap">
                <MapPin className="h-4 w-4" />
                <span>Popular:</span>
              </div>
              <div className="flex gap-2">
                {['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'].map((location) => (
                  <Badge 
                    key={location}
                    className="cursor-pointer bg-white text-gray-700 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 px-3 py-1.5 font-medium rounded-lg hover:shadow-sm whitespace-nowrap"
                    onClick={() => handleLocationClick(location)}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
