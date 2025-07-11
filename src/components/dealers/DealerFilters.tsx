
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DealerFiltersProps {
  selectedLocation: string;
  selectedBrand: string;
  onLocationChange: (location: string) => void;
  onBrandChange: (brand: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const DealerFilters = ({ 
  selectedLocation, 
  selectedBrand, 
  onLocationChange, 
  onBrandChange, 
  onApplyFilters,
  onClearFilters 
}: DealerFiltersProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <select 
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
        >
          <option value="">All Locations</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
        </select>
        <select 
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
        >
          <option value="">All Brands</option>
          <option value="Maruti Suzuki">Maruti Suzuki</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Tata">Tata</option>
          <option value="BMW">BMW</option>
          <option value="Audi">Audi</option>
          <option value="Mercedes">Mercedes</option>
        </select>
        <Button variant="outline" size="sm" className="shadow-sm" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </div>

      {/* Show active filters */}
      {(selectedLocation || selectedBrand) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedLocation && (
            <Badge variant="secondary" className="text-xs">
              Location: {selectedLocation}
              <button 
                onClick={() => onLocationChange('')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedBrand && (
            <Badge variant="secondary" className="text-xs">
              Brand: {selectedBrand}
              <button 
                onClick={() => onBrandChange('')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs h-6"
          >
            Clear All
          </Button>
        </div>
      )}
    </>
  );
};

export default DealerFilters;
