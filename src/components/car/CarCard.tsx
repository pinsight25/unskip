import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Eye, Star, Shield, Calendar, Fuel, Settings } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`group hover:shadow-card transition-all duration-300 ${
      car.featured ? 'ring-2 ring-primary/20 shadow-featured' : ''
    }`}>
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <img
            src={car.images[0]}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.featured && (
              <Badge className="bg-accent text-accent-foreground font-semibold">
                Featured
              </Badge>
            )}
            {car.verified && (
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {car.isRentAvailable && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Rent Available
              </Badge>
            )}
          </div>

          {/* Seller Type Badge */}
          <div className="absolute top-3 right-3">
            {car.seller.type === 'dealer' && (
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                Dealer
              </Badge>
            )}
          </div>

          {/* Views Counter */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {car.views}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title & Price */}
          <div className="space-y-1">
            <Link to={`/car/${car.id}`} className="block">
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors group-hover:text-primary">
                {car.title}
              </h3>
            </Link>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(car.price)}
            </p>
            {car.isRentAvailable && car.rentPrice && (
              <p className="text-sm text-muted-foreground">
                Rent: ₹{car.rentPrice.daily.toLocaleString('en-IN')}/day
              </p>
            )}
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {car.year}
            </div>
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              {car.transmission}
            </div>
            <div className="flex items-center">
              <Fuel className="h-4 w-4 mr-1" />
              {car.fuelType}
            </div>
          </div>

          {/* Mileage & Location */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {car.mileage.toLocaleString('en-IN')} km
            </span>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {car.location}
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {car.seller.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{car.seller.name}</p>
                {car.seller.verified && (
                  <div className="flex items-center text-xs text-success">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Seller
                  </div>
                )}
              </div>
            </div>
            
            {car.seller.rating > 0 && (
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 text-accent fill-current mr-1" />
                {car.seller.rating}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;