
interface DealerInventoryHeaderProps {
  carsCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const DealerInventoryHeader = ({ carsCount, sortBy, onSortChange }: DealerInventoryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center desktop-header-section gap-4 md:gap-6 px-4 md:px-0">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Available Inventory</h2>
        <p className="text-gray-600 text-base md:text-lg">{carsCount} cars available</p>
      </div>
      
      <select 
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto h-12"
      >
        <option value="">Sort by: Featured</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="year_desc">Year: Newest First</option>
        <option value="mileage_asc">Mileage: Best First</option>
      </select>
    </div>
  );
};

export default DealerInventoryHeader;
