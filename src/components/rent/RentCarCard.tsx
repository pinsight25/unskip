
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RentCar } from '@/types/rent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Shield, Fuel, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RentCarCardProps {
  car: RentCar;
  onSave?: (carId: string) => void;
  isSaved?: boolean;
}

const RentCarCard = ({ car, onSave, isSaved = false }: RentCarCardProps) => {
  const [isHearted, setIsHearted] = useState(isSaved);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHearted(!isHearted);
    if (onSave) {
      onSave(car.id);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const getRentTypeLabel = (type: string) => {
    const labels = {
      economy: 'Economy',
      premium: 'Premium',
      luxury: 'Luxury',
      suv: 'SUV'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getRentTypeColor = (type: string) => {
    const colors = {
      economy: 'bg-green-100 text-green-700',
      premium: 'bg-blue-100 text-blue-700',
      luxury: 'bg-purple-100 text-purple-700',
      suv: 'bg-orange-100 text-orange-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="group overflow-hidden w-full max-w-[350px] mx-auto hover:shadow-lg transition-all duration-200">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-ratio-4-3 overflow-hidden">
          <img
            src={car.images[0]}
            alt={car.title}
            className="img-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.featured && (
              <Badge className="bg-primary text-white text-xs px-2 py-1">
                Featured
              </Badge>
            )}
            {car.verified && (
              <Badge className="bg-green-500 text-white text-xs px-2 py-1 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
            <Badge className={cn("text-xs px-2 py-1", getRentTypeColor(car.rentType))}>
              {getRentTypeLabel(car.rentType)}
            </Badge>
          </div>

          {/* Heart Button */}
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isHearted ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </button>

          {/* Availability Status */}
          <div className="absolute bottom-3 left-3">
            <Badge className={cn(
              "text-xs px-2 py-1",
              car.availability.available 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            )}>
              {car.availability.available ? 'Available Now' : 'Not Available'}
            </Badge>
          </div>
        </div>

        <div className="card-padding flex-1 flex flex-col">
          {/* Title & Rent Price */}
          <div className="element-spacing">
            <Link to={`/rent/${car.id}`} className="block">
              <h3 className="heading-4 hover:text-primary transition-colors line-clamp-2 mb-2">
                {car.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(car.rentPrice.daily)}/day
                </p>
                <p className="small-text text-gray-500">
                  {formatPrice(car.rentPrice.weekly)}/week
                </p>
              </div>
              <div className="text-right">
                <p className="label-text">Security Deposit</p>
                <p className="small-text font-semibold text-gray-700">
                  {formatPrice(car.securityDeposit)}
                </p>
              </div>
            </div>
          </div>

          {/* Car Specs */}
          <div className="element-spacing">
            <div className="grid grid-cols-2 gap-2 small-text text-gray-600">
              <div className="flex items-center gap-1">
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel className="h-3 w-3" />
                <span>{car.fuelType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="element-spacing">
            <div className="flex flex-wrap gap-1">
              {car.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                >
                  {feature}
                </Badge>
              ))}
              {car.features.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                >
                  +{car.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Rental Policies */}
          <div className="element-spacing">
            <div className="space-y-1 small-text text-gray-600">
              <div className="flex justify-between">
                <span>KM Limit:</span>
                <span>{car.policies.kmLimit} km/day</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance:</span>
                <span className={car.policies.insuranceIncluded ? "text-green-600" : "text-red-600"}>
                  {car.policies.insuranceIncluded ? "Included" : "Not Included"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Min Period:</span>
                <span>{car.policies.minRentalPeriod} day{car.policies.minRentalPeriod > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="element-spacing">
            <div className="flex items-center justify-between small-text">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-gray-900">{car.seller.name}</p>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{car.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{car.seller.rating}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-3">
            <Button 
              size="sm"
              className="w-full"
              disabled={!car.availability.available}
            >
              {car.availability.available ? 'Book Now' : 'Not Available'}
            </Button>
            <div className="grid grid-cols-2 grid-gap">
              <Button variant="outline" size="sm">
                Details
              </Button>
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentCarCard;
