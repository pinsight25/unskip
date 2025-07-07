
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Card, CardContent } from '@/components/ui/card';
import MobileCarImage from './MobileCarImage';
import MobileCarBadges from './MobileCarBadges';
import MobileCarPrice from './MobileCarPrice';
import MobileCarDetails from './MobileCarDetails';
import MobileCarActions from './MobileCarActions';

interface MobileCarCardProps {
  car: Car;
  onSave: (carId: string) => void;
  isSaved: boolean;
  onMakeOffer: (car: Car) => void;
  onChat: (car: Car) => void;
  onTestDrive: (car: Car) => void;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
}

const MobileCarCard = ({ 
  car, 
  onSave, 
  isSaved, 
  onMakeOffer, 
  onChat, 
  onTestDrive, 
  offerStatus 
}: MobileCarCardProps) => {

  return (
    <Card className="mx-4 mb-4 overflow-hidden">
      <CardContent className="p-0">
        <MobileCarImage 
          images={car.images}
          title={car.title}
          featured={car.featured}
          verified={car.verified}
          isSaved={isSaved} 
          onSave={() => onSave(car.id)} 
        />
        
        <div className="p-4">
          <MobileCarBadges featured={car.featured} verified={car.verified} />
          
          <Link to={`/car/${car.id}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {car.title}
            </h3>
          </Link>

          <MobileCarPrice 
            price={car.price} 
            rentalRate={car.rentPrice?.daily}
            isRentAvailable={car.isRentAvailable}
          />

          <MobileCarDetails 
            year={car.year}
            transmission={car.transmission}
            fuelType={car.fuelType}
            mileage={car.mileage}
            location={car.location}
            seller={car.seller}
          />
          
          <MobileCarActions 
            onMakeOffer={() => onMakeOffer(car)}
            onChat={() => onChat(car)}
            onTestDrive={() => onTestDrive(car)}
            offerStatus={offerStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileCarCard;
