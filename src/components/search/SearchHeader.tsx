
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMake: string;
  selectedFuel: string[];
  selectedYear: string;
  priceRange: [number, number];
  onClearFilters: () => void;
  onRemoveMake: () => void;
  onRemoveFuel: (fuel: string) => void;
  onRemoveYear: () => void;
}

const SearchHeader = ({
  searchQuery,
  onSearchChange,
  selectedMake,
  selectedFuel,
  selectedYear,
  priceRange,
  onClearFilters,
  onRemoveMake,
  onRemoveFuel,
  onRemoveYear
}: SearchHeaderProps) => {
  const hasActiveFilters = selectedMake || selectedFuel.length > 0 || selectedYear || 
    priceRange[0] > 0 || priceRange[1] < 5000000;

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Advanced Search</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search cars by make, model, or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base border-2 focus:border-primary"
          />
        </div>
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedMake && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {selectedMake}
                <button 
                  onClick={onRemoveMake}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedFuel.map(fuel => (
              <Badge key={fuel} variant="secondary" className="bg-primary/10 text-primary">
                {fuel}
                <button 
                  onClick={() => onRemoveFuel(fuel)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedYear && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {selectedYear}+ Year
                <button 
                  onClick={onRemoveYear}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHeader;
