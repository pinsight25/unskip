
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCity } from '@/contexts/CityContext';

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
  city: string;
}

// Popular areas by city
const popularAreasByCity: Record<string, string[]> = {
  Chennai: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR', 'Tambaram', 'Chromepet'],
  Mumbai: ['Andheri', 'Bandra', 'Borivali', 'Thane', 'Navi Mumbai', 'Powai', 'Malad', 'Goregaon'],
  Delhi: ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Dwarka', 'Rohini', 'Vasant Kunj', 'Janakpuri'],
  Bangalore: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'Marathahalli', 'Jayanagar', 'BTM Layout'],
  Hyderabad: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Kondapur', 'Madhapur', 'Secunderabad', 'Kukatpally'],
  Pune: ['Koregaon Park', 'Hinjewadi', 'Baner', 'Wakad', 'Kothrud', 'Deccan', 'Camp', 'Aundh'],
  Kolkata: ['Salt Lake', 'Park Street', 'Ballygunge', 'Alipore', 'New Town', 'Rajarhat', 'Howrah', 'Jadavpur']
};

const SearchFilters = ({ onFilterChange, onSearch, hideContent = false }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { selectedCity } = useCity();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const currentPopularAreas = popularAreasByCity[selectedCity] || popularAreasByCity.Chennai;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      onFilterChange({
        query: searchQuery,
        type: 'all',
        priceRange: [0, 5000000],
        location: selectedLocation,
        city: selectedCity
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
        location: newLocation,
        city: selectedCity
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
        location: '',
        city: selectedCity
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="space-y-4 lg:space-y-5">
          {/* Search Bar - Fixed height to prevent expansion */}
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
              className="px-6 lg:px-8 h-11 lg:h-12 text-base font-bold flex-shrink-0"
            >
              Search
            </Button>
          </div>

          {/* Popular Areas - Horizontal scroll for both mobile and desktop */}
          {!hideContent && (
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center justify-start max-w-5xl mx-auto">
                <span className="text-sm lg:text-base text-gray-700 font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  Popular Areas in {selectedCity}
                </span>
              </div>
              
              {/* Horizontal scroll container for all screen sizes */}
              <div className="max-w-5xl mx-auto relative">
                {/* Left scroll arrow - desktop only */}
                {showLeftArrow && (
                  <button
                    onClick={scrollLeft}
                    className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}

                {/* Right scroll arrow - desktop only */}
                {showRightArrow && (
                  <button
                    onClick={scrollRight}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                )}

                {/* Scrollable areas container - Fixed height with proper padding */}
                <div 
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 lg:px-14 h-[52px]" 
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {currentPopularAreas.map((location) => {
                    const isSelected = selectedLocation === location;
                    return (
                      <button
                        key={location}
                        onClick={() => handleLocationClick(location)}
                        className={`flex-shrink-0 px-4 lg:px-5 py-2 lg:py-2.5 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap h-[40px] lg:h-[44px] flex items-center ${
                          isSelected 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 transform scale-105' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        {location}
                      </button>
                    );
                  })}
                  <div className="w-4 flex-shrink-0" />
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
