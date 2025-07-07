
import { Car } from '@/types/car';
import CompactCarCard from '@/components/car/CompactCarCard';
import CompactMobileCarCard from '@/components/mobile/CompactMobileCarCard';
import { Button } from '@/components/ui/button';

interface ResultsGridProps {
  cars: Car[];
  savedCars: string[];
  isMobile: boolean;
  onSaveCar: (carId: string) => void;
  onMakeOffer: (car: Car) => void;
  onChat: (car: Car) => void;
  onTestDrive: (car: Car) => void;
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

const ResultsGrid = ({
  cars,
  savedCars,
  isMobile,
  onSaveCar,
  onMakeOffer,
  onChat,
  onTestDrive,
  getOfferStatus
}: ResultsGridProps) => {
  return (
    <>
      <div className="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4">
        {cars.map((car) => (
          isMobile ? (
            <CompactMobileCarCard 
              key={car.id} 
              car={car} 
              onSave={onSaveCar}
              isSaved={savedCars.includes(car.id)}
              onMakeOffer={() => onMakeOffer(car)}
            />
          ) : (
            <CompactCarCard 
              key={car.id} 
              car={car} 
              onSave={onSaveCar}
              isSaved={savedCars.includes(car.id)}
            />
          )
        ))}
      </div>

      {/* Load More - Desktop with proper spacing */}
      {cars.length > 0 && !isMobile && (
        <div className="text-center mt-8 pb-8">
          <Button variant="outline" size="default" className="h-10 px-8 text-sm font-medium">
            Load More Cars
          </Button>
        </div>
      )}
    </>
  );
};

export default ResultsGrid;
