
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Shield, Award, Building2 } from 'lucide-react';
import { Car } from '@/types/car';

interface CarCardImageProps {
  car: Car;
  isSaved: boolean;
  onSave: () => void;
}

const CarCardImage = ({ car, isSaved, onSave }: CarCardImageProps) => {
  // Debug logging for badge display
  console.log('CarCardImage car:', { title: car.title, featured: car.featured, verified: car.verified, dealerVerified: car.seller?.dealerVerified });
  return (
    <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
      <Link to={`/car/${car.id}`}>
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer rounded-lg"
        />
      </Link>
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {car.featured && (
          <Badge className="bg-amber-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-lg">
            Featured
          </Badge>
        )}
        {car.verified && (
          <Badge className="bg-green-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-lg">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        {/* Dealer verification badge - use car.seller_type only */}
        {car.seller_type === 'dealer' && car.seller?.dealerVerified === true && (
          <Badge className="bg-blue-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-lg">
            <Building2 className="h-3 w-3 mr-1" />
            Verified Dealer
          </Badge>
        )}
        {car.seller_type === 'dealer' && car.seller?.dealerVerified === false && (
          <Badge className="bg-gray-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-lg">
            <Building2 className="h-3 w-3 mr-1" />
            Unverified Dealer
          </Badge>
        )}
        {/* No dealer badge for individual/owner */}
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
