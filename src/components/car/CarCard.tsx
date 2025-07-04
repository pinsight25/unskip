
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Star, Shield, Calendar, Fuel, Settings, Heart, Share2, MessageCircle, Gauge, DollarSign, Clock } from 'lucide-react';

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
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white border-0 overflow-hidden hover:scale-[1.02] shadow-lg">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={car.images[0]}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Save Heart Icon */}
          <div className="absolute top-4 right-4">
            <Button size="sm" variant="secondary" className="h-10 w-10 p-0 bg-white/90 hover:bg-white shadow-lg rounded-full group-hover:scale-110 transition-all duration-300">
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
            </Button>
          </div>
          
          {/* Modern Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {car.featured && (
              <Badge className="bg-accent/80 backdrop-blur-sm text-white border-0 font-medium text-xs px-3 py-1 rounded-full shadow-lg">
                ⭐ Featured
              </Badge>
            )}
            {car.verified && (
              <Badge className="bg-success/80 backdrop-blur-sm text-white border-0 font-medium text-xs px-3 py-1 rounded-full shadow-lg">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {car.isRentAvailable && (
              <Badge className="bg-primary/80 backdrop-blur-sm text-white border-0 font-medium text-xs px-3 py-1 rounded-full shadow-lg">
                🚗 Also Available for Rent
              </Badge>
            )}
          </div>

          {/* Seller Type Badge */}
          <div className="absolute top-4 right-16">
            {car.seller.type === 'dealer' && (
              <Badge className="bg-white/90 text-foreground font-medium text-xs px-3 py-1 rounded-full shadow-lg">
                Certified Dealer
              </Badge>
            )}
          </div>

          {/* Views & Quick Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs flex items-center font-medium">
              <Eye className="h-3 w-3 mr-1" />
              {car.views}
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Button size="sm" variant="secondary" className="h-9 w-9 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6 space-y-5">
          {/* Title & Price */}
          <div className="space-y-3">
            <Link to={`/car/${car.id}`} className="block">
              <h3 className="font-bold text-xl leading-tight hover:text-primary transition-colors group-hover:text-primary line-clamp-2">
                {car.title}
              </h3>
            </Link>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-black text-primary">
                {formatPrice(car.price)}
              </p>
              {car.isRentAvailable && car.rentPrice && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Rent from</p>
                  <p className="text-sm font-bold text-secondary">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Key Details Grid with Icons */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-muted-foreground bg-secondary/5 p-3 rounded-lg">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span className="font-semibold">{car.year}</span>
            </div>
            <div className="flex items-center text-muted-foreground bg-secondary/5 p-3 rounded-lg">
              <Gauge className="h-4 w-4 mr-2 text-primary" />
              <span className="font-semibold">{car.mileage.toLocaleString('en-IN')} km</span>
            </div>
            <div className="flex items-center text-muted-foreground bg-secondary/5 p-3 rounded-lg">
              <Fuel className="h-4 w-4 mr-2 text-primary" />
              <span className="font-semibold">{car.fuelType}</span>
            </div>
            <div className="flex items-center text-muted-foreground bg-secondary/5 p-3 rounded-lg">
              <Settings className="h-4 w-4 mr-2 text-primary" />
              <span className="font-semibold">{car.transmission}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-muted-foreground bg-primary/5 p-3 rounded-lg">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="font-semibold">{car.location}</span>
          </div>

          {/* Enhanced Seller Info with Ratings & Response Time */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {car.seller.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{car.seller.name}</p>
                  {car.seller.verified && (
                    <Badge className="bg-success/10 text-success border-success/20 text-xs px-2 py-0.5 rounded-full">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-3">
                  {car.seller.rating > 0 && (
                    <div className="flex items-center text-accent">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      <span className="font-medium">{car.seller.rating}</span>
                    </div>
                  )}
                  <div className="flex items-center text-green-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="font-medium">Responds in 2 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center font-medium">
              💬 No lowball guarantee • 🛡️ Platform verified
            </p>
          </div>

          {/* Core Action Buttons */}
          <div className="space-y-3">
            <Button size="sm" className="w-full premium-gradient font-medium text-white hover:shadow-lg transition-all duration-300">
              <DollarSign className="h-4 w-4 mr-2" />
              Make an Offer
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="font-medium hover:bg-primary hover:text-white transition-all duration-300">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button variant="outline" size="sm" className="font-medium hover:bg-secondary hover:text-white transition-all duration-300">
                Test Drive
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
