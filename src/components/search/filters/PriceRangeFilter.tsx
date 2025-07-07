
import { Input } from '@/components/ui/input';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const PriceRangeFilter = ({ priceRange, onPriceRangeChange }: PriceRangeFilterProps) => {
  return (
    <div>
      <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
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
  );
};

export default PriceRangeFilter;
