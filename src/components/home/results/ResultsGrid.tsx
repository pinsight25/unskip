
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';

interface ResultsGridProps {
  cars: Car[];
  savedCars: string[];
  isMobile: boolean;
  onSaveCar: (carId: string) => void;
  isSaving?: string | null;
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
  getOfferStatus,
  isSaving
}: ResultsGridProps) => {
  return (
    <>
      <div className="md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
        {cars.map((car) => (
          isMobile ? (
            <MobileCarCard 
              key={car.id} 
              car={car} 
              onSave={onSaveCar}
              isSaved={savedCars.includes(car.id)}
              isSaving={isSaving === car.id}
              onMakeOffer={() => onMakeOffer(car)}
              onChat={() => onChat(car)}
              onTestDrive={() => onTestDrive(car)}
              offerStatus={getOfferStatus(car.id)}
            />
          ) : (
            <CarCard 
              key={car.id} 
              car={car} 
              onSave={onSaveCar}
              isSaved={savedCars.includes(car.id)}
              isSaving={isSaving === car.id}
            />
          )
        ))}
      </div>

      {/* Load More - Desktop with proper spacing */}
      {cars.length > 0 && !isMobile && (
        <div className="text-center mt-12 pb-8">
          <Button variant="outline" size="default" className="h-12 px-12 text-[15px] font-medium">
            Load More Cars
          </Button>
        </div>
      )}
    </>
  );
};

export default ResultsGrid;
