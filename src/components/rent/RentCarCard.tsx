
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RentCar } from '@/types/rent';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Shield, MapPin, Fuel, Gauge, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RentCarCardProps {
  car: RentCar;
}

const RentCarCard = ({ car }: RentCarCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative">
          <Link to={`/car/${car.id}`}>
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.featured && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {car.verified && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              Also for sale
            </Badge>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
            onClick={handleSave}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title & Pricing */}
          <Link to={`/car/${car.id}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {car.title}
            </h3>
          </Link>

          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(car.rentPrice.daily)}
              </span>
              <span className="text-sm text-gray-500">/day</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatPrice(car.rentPrice.weekly)}/week • {formatPrice(car.rentPrice.monthly)}/month
            </div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {car.year}
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              {car.mileage.toLocaleString()} km
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              {car.fuelType}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {car.transmission}
            </div>
          </div>

          {/* Location & Features */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {car.location}
            </div>
            
            {car.features && car.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {car.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {car.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{car.features.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentCarCard;
