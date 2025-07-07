
import { useState, useEffect } from 'react';
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';

interface DealerInventoryGridProps {
  cars: Car[];
}

const DealerInventoryGrid = ({ cars }: DealerInventoryGridProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full px-4 md:px-0">
      {cars.length > 0 ? (
        isMobile ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-gap-standard w-full">
            {cars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                onSave={() => {}}
                isSaved={false}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 md:py-20">
          <h3 className="text-lg md:text-xl font-semibold mb-2">No cars available</h3>
          <p className="text-gray-600 mb-4 text-base md:text-lg">This dealer currently has no cars in stock</p>
        </div>
      )}
    </div>
  );
};

export default DealerInventoryGrid;
