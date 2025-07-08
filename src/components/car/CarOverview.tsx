
import CarPriceSection from './CarPriceSection';

interface CarOverviewProps {
  title: string;
  price: number;
  rentPrice?: {
    daily: number;
    weekly: number;
  };
  description: string;
}

const CarOverview = ({ title, price, rentPrice, description }: CarOverviewProps) => {
  return (
    <div className="space-y-4">
      <CarPriceSection 
        title={title}
        price={price}
        rentPrice={rentPrice}
      />
      
      <div>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default CarOverview;
