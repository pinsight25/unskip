
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Heart } from 'lucide-react';
import { Car } from '@/types/car';

interface CarCardImageProps {
  car: Car;
  isSaved: boolean;
  onSave: () => void;
}

const CarCardImage = ({ car, isSaved, onSave }: CarCardImageProps) => {
  return (
    <div className="relative w-full h-[200px] overflow-hidden">
      <Link to={`/car/${car.id}`}>
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
        />
      </Link>
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {car.featured && (
          <Badge className="bg-amber-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-sm">
            Featured
          </Badge>
        )}
        {car.verified && (
          <Badge className="bg-green-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-sm">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* Save Button */}
      <div className="absolute top-3 right-3">
        <Button 
          size="sm" 
          variant="secondary" 
          className={`h-8 w-8 p-0 shadow-md rounded-full border ${
            isSaved ? 'bg-red-50 hover:bg-red-100 border-red-200' : 'bg-white hover:bg-gray-50 border-gray-200'
          }`}
          onClick={onSave}
        >
          <Heart className={`h-4 w-4 transition-colors ${
            isSaved ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
          }`} />
        </Button>
      </div>

      {/* Views Badge */}
      <div className="absolute bottom-3 left-3">
        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center font-medium">
          <Eye className="h-3 w-3 mr-1" />
          {car.views}
        </div>
      </div>
    </div>
  );
};

export default CarCardImage;
