
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import PriceRangeFilter from './filters/PriceRangeFilter';
import MakeFilter from './filters/MakeFilter';
import YearFilter from './filters/YearFilter';
import FuelTypeFilter from './filters/FuelTypeFilter';

interface SearchFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedMake: string;
  onMakeChange: (make: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedFuel: string[];
  onFuelToggle: (fuel: string) => void;
  onClearFilters: () => void;
  makes: string[];
}

const SearchFilters = ({
  priceRange,
  onPriceRangeChange,
  selectedMake,
  onMakeChange,
  selectedYear,
  onYearChange,
  selectedFuel,
  onFuelToggle,
  onClearFilters,
  makes
}: SearchFiltersProps) => {
  return (
    <div className="w-full">
      <Card className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
        </h3>
        
        <div className="space-y-6">
          <PriceRangeFilter 
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
          />
          
          <MakeFilter 
            selectedMake={selectedMake}
            onMakeChange={onMakeChange}
            makes={makes}
          />

          <YearFilter 
            selectedYear={selectedYear}
            onYearChange={onYearChange}
          />
          
          <FuelTypeFilter 
            selectedFuel={selectedFuel}
            onFuelToggle={onFuelToggle}
          />
          
          <Button 
            onClick={onClearFilters}
            variant="outline" 
            className="w-full mt-6"
          >
            Clear Filters
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SearchFilters;
