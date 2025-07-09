
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterTabs from './FilterTabs';

interface SearchFiltersProps {
  currentFilters: any;
  onFilterChange: (filters: any) => void;
  onTypeChange: (type: string) => void;
  isSearching: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  resultCount: number;
}

const SearchFilters = ({
  currentFilters,
  onFilterChange,
  onTypeChange,
  isSearching,
  searchQuery,
  onSearch,
  onClearSearch,
  resultCount
}: SearchFiltersProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularAreas = [
    'T. Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Guindy',
    'Porur', 'Tambaram', 'Chrompet', 'Sholinganallur', 'OMR'
  ];

  const suggestions = [
    'Maruti Swift',
    'Honda City',
    'Hyundai i20',
    'Toyota Innova',
    'Mahindra XUV500'
  ];

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    onClearSearch();
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Section - Compact */}
        <div className="py-3">
          <div className="relative" ref={searchRef}>
            {/* Search Input - Compact Size */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search cars by brand, model, or location..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(localQuery)}
                className="pl-10 pr-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
              />
              {localQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Search Suggestions - More Compact */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="mb-2">
                    <h4 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Popular Areas
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {popularAreas.map((area) => (
                        <button
                          key={area}
                          onClick={() => handleSearch(area)}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Popular Searches</h4>
                    <div className="space-y-1">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Actions - Compact */}
          {isSearching && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">
                {resultCount} results for "{searchQuery}"
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSearch}
                className="text-xs h-7"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Filter Tabs - Fix props */}
        <FilterTabs
          activeType={currentFilters.type}
          onTypeChange={onTypeChange}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
