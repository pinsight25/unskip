
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Star } from 'lucide-react';

interface CarCardImageProps {
  car: Car;
  isSaved: boolean;
  onSave: () => void;
}

const CarCardImage = ({ car, isSaved, onSave }: CarCardImageProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative">
      <Link to={`/car/${car.id}`}>
        {!imageError ? (
          <img
            src={car.images[0]}
            alt={car.title}
            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </Link>
      
      {/* Badges positioned in top-left - removed "Also for rent" badge */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {car.featured && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        {car.verified && (
          <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* Save Button positioned in top-right corner */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSave();
        }}
      >
        <Heart 
          className={`h-4 w-4 ${
            isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`} 
        />
      </Button>
    </div>
  );
};

export default CarCardImage;
