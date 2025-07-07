
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface HomeResultsHeaderProps {
  totalCars: number;
  onFilterChange: (filters: any) => void;
  onSort: (sortBy: string) => void;
}

const HomeResultsHeader = ({ totalCars, onFilterChange, onSort }: HomeResultsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Featured Cars</h2>
        <p className="text-gray-600">{totalCars} cars available</p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {/* Handle mobile filters */}}
          className="md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        
        <select 
          onChange={(e) => onSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="">Sort by: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest First</option>
          <option value="mileage_asc">Mileage: Best First</option>
        </select>
      </div>
    </div>
  );
};

export default HomeResultsHeader;
