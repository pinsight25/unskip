
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';

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

  return (
    <div className="flex-1 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Search Results</h2>
          <p className="text-gray-600">{cars.length} cars found</p>
        </div>
        
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="">Sort by: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest First</option>
          <option value="mileage_asc">Mileage: Best First</option>
        </select>
      </div>
      
      {/* Search Results Grid with proper responsive layout */}
      {cars.length > 0 ? (
        <div className="w-full">
          {isMobile ? (
            <div className="space-y-4">
              {cars.map((car) => (
                <MobileCarCard 
                  key={car.id} 
                  car={car} 
                  onSave={() => {}}
                  isSaved={false}
                  onMakeOffer={() => {}}
                  onChat={() => {}}
                  onTestDrive={() => {}}
                  offerStatus="none"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {cars.map((car) => (
                <CarCard 
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
          <h3 className="text-lg font-semibold mb-2">No cars found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button onClick={() => window.location.reload()}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
