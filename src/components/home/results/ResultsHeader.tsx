
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car as CarIcon, Heart, Filter, SortAsc } from 'lucide-react';

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
  return (
    <div className="hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <CarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {filteredCarsCount} Cars Available
            </h2>
            <div className="flex items-center gap-4 mt-2">
              {currentFilters.type !== 'all' && (
                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-[14px] px-3 py-1.5 font-medium">
                  {currentFilters.type === 'dealer' ? 'Dealers Only' : 'Individual Owners'}
                </Badge>
              )}
              {savedCarsCount > 0 && (
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 text-[14px] px-3 py-1.5 font-medium">
                  <Heart className="h-4 w-4 mr-1 fill-current" />
                  {savedCarsCount} saved
                </Badge>
              )}
            </div>
          </div>
        </div>
        {currentFilters.query && (
          <p className="text-gray-600 ml-20 text-[14px]">
            Showing results for "<strong>{currentFilters.query}</strong>"
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <SortAsc className="h-5 w-5 text-gray-500" />
          <select 
            onChange={(e) => onSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-w-[180px]"
          >
            <option value="">Sort by Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Year: Newest First</option>
            <option value="mileage_asc">Mileage: Low to High</option>
          </select>
        </div>
        
        <Button variant="outline" size="default" className="h-11 px-5 text-[14px] font-medium border-gray-300 hover:border-orange-500 hover:text-orange-500">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  );
};

export default ResultsHeader;
