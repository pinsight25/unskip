
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

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
    <div className="w-full lg:w-72 flex-shrink-0">
      <Card className="p-4 lg:p-6 sticky top-24">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
        </h3>
        
        <div className="space-y-4 lg:space-y-6">
          {/* Price Range - Side by side layout */}
          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Min (₹)" 
                value={priceRange[0] || ''}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="text-sm flex-1"
              />
              <Input 
                type="number" 
                placeholder="Max (₹)" 
                value={priceRange[1] === 5000000 ? '' : priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 5000000])}
                className="text-sm flex-1"
              />
            </div>
          </div>
          
          {/* Make */}
          <div>
            <h4 className="font-medium mb-2">Make</h4>
            <select 
              value={selectedMake}
              onChange={(e) => onMakeChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Makes</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <h4 className="font-medium mb-2">Year</h4>
            <select 
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Any Year</option>
              <option value="2020">2020 & Newer</option>
              <option value="2018">2018 & Newer</option>
              <option value="2015">2015 & Newer</option>
              <option value="2010">2010 & Newer</option>
            </select>
          </div>
          
          {/* Fuel Type */}
          <div>
            <h4 className="font-medium mb-2">Fuel Type</h4>
            <div className="space-y-2">
              {['Petrol', 'Diesel', 'CNG', 'Electric'].map((fuel) => (
                <label key={fuel} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedFuel.includes(fuel)}
                    onChange={() => onFuelToggle(fuel)}
                  />
                  <span className="text-sm">{fuel}</span>
                </label>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={onClearFilters}
            variant="outline" 
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SearchFilters;
