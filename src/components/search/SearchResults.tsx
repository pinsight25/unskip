
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Car } from '@/types/car';
import CompactCarCard from '@/components/car/CompactCarCard';
import CompactMobileCarCard from '@/components/mobile/CompactMobileCarCard';

interface SearchResultsProps {
  cars: Car[];
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SearchResults = ({ cars, sortBy, onSortChange }: SearchResultsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMakeOffer = (car: Car) => {
    console.log('Make offer for car:', car.id);
  };

  return (
    <div className="flex-1 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold">Search Results</h2>
          <p className="text-sm text-gray-600">{cars.length} cars found</p>
        </div>
        
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-auto bg-white"
        >
          <option value="">Sort by: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest First</option>
          <option value="mileage_asc">Mileage: Best First</option>
        </select>
      </div>
      
      {/* Compact Search Results Grid */}
      {cars.length > 0 ? (
        <div className="w-full overflow-hidden pb-20 md:pb-8">
          {isMobile ? (
            <div className="space-y-0">
              {cars.map((car) => (
                <CompactMobileCarCard 
                  key={car.id} 
                  car={car} 
                  onSave={() => {}}
                  isSaved={false}
                  onMakeOffer={() => handleMakeOffer(car)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cars.map((car) => (
                <CompactCarCard 
                  key={car.id} 
                  car={car} 
                  onSave={() => {}}
                  isSaved={false}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-4">No cars found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Button onClick={() => window.location.reload()}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
