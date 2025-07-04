import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Star, Shield, Calendar, Fuel, Settings, Heart, Share2, Phone, MessageCircle } from 'lucide-react';

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
    <Card className={`group hover:shadow-premium transition-all duration-500 hover:-translate-y-2 bg-white border-border/50 overflow-hidden ${
      car.featured ? 'ring-2 ring-primary/30 shadow-premium' : 'hover:shadow-card'
    }`}>
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={car.images[0]}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {car.featured && (
              <Badge className="bg-accent text-white font-semibold shadow-lg animate-glow">
                ⭐ Featured
              </Badge>
            )}
            {car.verified && (
              <Badge variant="secondary" className="bg-success text-white border-0 shadow-lg">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {car.isRentAvailable && (
              <Badge variant="outline" className="bg-primary text-white border-0 shadow-lg">
                🚗 Rent Available
              </Badge>
            )}
          </div>

          {/* Seller Type Badge */}
          <div className="absolute top-4 right-4">
            {car.seller.type === 'dealer' && (
              <Badge variant="secondary" className="bg-white/90 text-foreground font-medium shadow-lg">
                Dealer
              </Badge>
            )}
          </div>

          {/* Views & Quick Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {car.views}
            </div>
            
            {/* Quick Action Buttons - Appear on Hover */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title & Price */}
          <div className="space-y-2">
            <Link to={`/car/${car.id}`} className="block">
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors group-hover:text-primary line-clamp-2">
                {car.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(car.price)}
              </p>
              {car.isRentAvailable && car.rentPrice && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Rent from</p>
                  <p className="text-sm font-semibold text-primary">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">{car.year}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Settings className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">{car.transmission}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Fuel className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">{car.fuelType}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium truncate">{car.location}</span>
            </div>
          </div>

          {/* Mileage */}
          <div className="text-center py-2 bg-secondary rounded-lg">
            <span className="text-sm text-muted-foreground">Driven </span>
            <span className="font-semibold text-foreground">{car.mileage.toLocaleString('en-IN')} km</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {car.seller.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{car.seller.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  {car.seller.verified && (
                    <>
                      <Shield className="h-3 w-3 mr-1 text-success" />
                      <span className="text-success">Verified</span>
                    </>
                  )}
                  {car.seller.rating > 0 && (
                    <>
                      {car.seller.verified && <span className="mx-1">•</span>}
                      <Star className="h-3 w-3 mr-1 text-accent fill-current" />
                      <span>{car.seller.rating}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-2 md:hidden">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;