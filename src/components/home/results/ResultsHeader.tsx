
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultsHeaderProps {
  filteredCarsCount: number;
  savedCarsCount: number;
  currentFilters: {
    query: string;
    type: 'all' | 'dealer' | 'individual';
  };
  onSort: (sortValue: string) => void;
  onFilterChange: (filters: any) => void;
}

const ResultsHeader = ({
  filteredCarsCount,
  savedCarsCount,
  currentFilters,
  onSort,
  onFilterChange
}: ResultsHeaderProps) => {
  const navigate = useNavigate();

  const handleMoreFilters = () => {
    navigate('/search');
  };

  return (
    <div className="hidden md:block mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {filteredCarsCount} Cars Available
          </h2>
          {currentFilters.query && (
            <p className="text-gray-600">
              Results for "{currentFilters.query}"
            </p>
          )}
          {savedCarsCount > 0 && (
            <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
              <Heart className="h-4 w-4 mr-1 fill-current" />
              {savedCarsCount} Saved
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleMoreFilters}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            More Filters
          </Button>
          
          <select
            onChange={(e) => onSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Year: Newest First</option>
            <option value="km-low">KM: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;
