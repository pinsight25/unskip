
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface SearchResultsViewProps {
  results: Car[];
  query: string;
  savedCars: string[];
  isMobile: boolean;
  onSaveCar: (carId: string) => void;
  onMakeOffer: (car: Car) => void;
  onChat: (car: Car) => void;
  onTestDrive: (car: Car) => void;
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

const SearchResultsView = ({
  results,
  query,
  savedCars,
  isMobile,
  onSaveCar,
  onMakeOffer,
  onChat,
  onTestDrive,
  getOfferStatus
}: SearchResultsViewProps) => {
  const [sortBy, setSortBy] = useState('');
  const [sortedResults, setSortedResults] = useState<Car[]>(results);

  useEffect(() => {
    setSortedResults(results);
  }, [results]);

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    if (!sortValue) {
      setSortedResults(results);
      return;
    }
    
    const sorted = [...results].sort((a, b) => {
      switch (sortValue) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'year_desc':
          return b.year - a.year;
        case 'mileage_asc':
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });
    setSortedResults(sorted);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No cars found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any cars matching "{query}". Try adjusting your search terms.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Browse All Cars
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 search-results-ultra-compact">
      {/* Sort Options - Ultra compact */}
      <div className="flex justify-between items-center results-to-cards">
        <div className="text-sm text-gray-600">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </div>
        <select 
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">Sort by Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest First</option>
          <option value="mileage_asc">Mileage: Low to High</option>
        </select>
      </div>

      {/* Results Grid - Ultra compact */}
      <div className="w-full">
        {isMobile ? (
          <div className="space-y-3 pb-20">
            {sortedResults.map((car) => (
              <MobileCarCard 
                key={car.id} 
                car={car} 
                onSave={onSaveCar}
                isSaved={savedCars.includes(car.id)}
                onMakeOffer={() => onMakeOffer(car)}
                onChat={() => onChat(car)}
                onTestDrive={() => onTestDrive(car)}
                offerStatus={getOfferStatus(car.id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-gap-compact">
            {sortedResults.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                onSave={onSaveCar}
                isSaved={savedCars.includes(car.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsView;
