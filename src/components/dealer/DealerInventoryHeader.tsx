
import { Car } from 'lucide-react';

interface DealerInventoryHeaderProps {
  carsCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const DealerInventoryHeader = ({ carsCount, sortBy, onSortChange }: DealerInventoryHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border-0 p-6 mx-4 md:mx-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6">
        <div className="flex items-center">
          <Car className="h-6 w-6 text-primary mr-3" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-1">Available Inventory</h2>
            <p className="text-gray-600 text-base md:text-lg">
              {carsCount === 0 ? 'No cars available' : `${carsCount} cars available`}
            </p>
          </div>
        </div>
        
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm md:text-base w-full sm:w-auto h-12 bg-white shadow-sm hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary/20 focus:border-primary"
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

export default DealerInventoryHeader;
