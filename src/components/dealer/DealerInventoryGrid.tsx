
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';

interface DealerInventoryGridProps {
  cars: Car[];
}

const DealerInventoryGrid = ({ cars }: DealerInventoryGridProps) => {
  return (
    <div className="w-full px-4 md:px-0">
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
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
