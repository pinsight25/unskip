
import { useState } from 'react';
import { useCity } from '@/contexts/CityContext';
import SearchBar from './SearchBar';
import PopularAreas from './PopularAreas';
import LocationStatus from './LocationStatus';

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
  const { selectedCity } = useCity();
  
  const currentPopularAreas = popularAreasByCity[selectedCity] || popularAreasByCity.Chennai;

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
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={clearSearch}
          />

          {/* Popular Areas */}
          {!hideContent && (
            <>
              <PopularAreas
                areas={currentPopularAreas}
                selectedLocation={selectedLocation}
                selectedCity={selectedCity}
                onLocationClick={handleLocationClick}
              />

              <LocationStatus
                selectedLocation={selectedLocation}
                onClear={clearSearch}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
