
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
    <div className="flex-1 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center component-spacing gap-4">
        <div>
          <h2 className="heading-2">Search Results</h2>
          <p className="small-text">{cars.length} cars found</p>
        </div>
        
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-w-[160px] h-9"
        >
          <option value="">Sort by: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest First</option>
          <option value="mileage_asc">Mileage: Best First</option>
        </select>
      </div>
      
      {/* Search Results Grid - Fixed responsive layout */}
      {cars.length > 0 ? (
        <div className="w-full overflow-hidden">
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
            <div className="cards-equal-height grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-gap w-full">
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
        <div className="text-center section-spacing">
          <h3 className="heading-3 mb-4">No cars found</h3>
          <p className="body-text mb-6">Try adjusting your search criteria</p>
          <Button onClick={() => window.location.reload()}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
