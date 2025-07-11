
import DealerCard from './DealerCard';

interface DealerGridProps {
  dealers: Array<{
    id: string;
    name: string;
    contactPerson: string;
    businessCategory: string;
    specialization: string;
    location: string;
    establishmentYear: string;
    carsInStock: number;
    verified: boolean;
    brands: string[];
    shopPhoto?: string;
  }>;
}

const DealerGrid = ({ dealers }: DealerGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dealers.map((dealer) => (
        <DealerCard key={dealer.id} dealer={dealer} />
      ))}
    </div>
  );
};

export default DealerGrid;
