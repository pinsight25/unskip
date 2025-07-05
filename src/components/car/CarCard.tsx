
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import { MapPin, Eye, Star, Shield, Calendar, Fuel, Settings, Heart, Share2, MessageCircle, Gauge, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CarCardProps {
  car: Car;
  onSave?: (carId: string) => void;
  isSaved?: boolean;
}

const CarCard = ({ car, onSave, isSaved = false }: CarCardProps) => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [offerMade, setOfferMade] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMakeOffer = () => {
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleChat = () => {
    if (!offerMade) {
      toast({
        title: "Make an Offer First",
        description: "Please make an offer before starting a chat with the seller.",
        variant: "destructive"
      });
      return;
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(car.id);
    }
  };

  const handleOTPSuccess = () => {
    setIsVerified(true);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
    setOfferMade(true);
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border overflow-hidden hover:scale-[1.01] shadow-sm max-w-sm mx-auto">
        <CardContent className="p-0">
          {/* Compact Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Link to={`/car/${car.id}`}>
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </Link>
            
            {/* Save Heart Icon */}
            <div className="absolute top-2 right-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className={`h-8 w-8 p-0 shadow-md rounded-full ${
                  isSaved ? 'bg-red-50 hover:bg-red-100' : 'bg-white/90 hover:bg-white'
                }`}
                onClick={handleSave}
              >
                <Heart className={`h-4 w-4 transition-colors ${
                  isSaved ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                }`} />
              </Button>
            </div>
            
            {/* Compact Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {car.featured && (
                <Badge className="bg-amber-500/90 backdrop-blur-sm text-white border-0 text-xs px-2 py-1 rounded-md">
                  Featured
                </Badge>
              )}
              {car.verified && (
                <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 text-xs px-2 py-1 rounded-md">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Views */}
            <div className="absolute bottom-2 left-2">
              <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {car.views}
              </div>
            </div>
          </div>

          {/* Compact Content Section */}
          <div className="p-4 space-y-3">
            {/* Title & Price */}
            <div className="space-y-2">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="font-medium text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                  {car.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(car.price)}
                </p>
                {car.isRentAvailable && car.rentPrice && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Rent</p>
                    <p className="text-sm font-semibold text-secondary">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
                  </div>
                )}
              </div>
            </div>

            {/* Key Details Grid - Compact */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-muted-foreground bg-gray-50 p-2 rounded-lg">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{car.year}</span>
              </div>
              <div className="flex items-center text-muted-foreground bg-gray-50 p-2 rounded-lg">
                <Gauge className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{(car.mileage/1000).toFixed(0)}k km</span>
              </div>
              <div className="flex items-center text-muted-foreground bg-gray-50 p-2 rounded-lg">
                <Fuel className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{car.fuelType}</span>
              </div>
              <div className="flex items-center text-muted-foreground bg-gray-50 p-2 rounded-lg">
                <Settings className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{car.transmission}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center text-muted-foreground bg-primary/5 p-2 rounded-lg">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">{car.location}</span>
            </div>

            {/* Compact Seller Info */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {car.seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{car.seller.name}</p>
                    {car.seller.verified && (
                      <Badge className="bg-success/10 text-success border-success/20 text-xs px-2 py-0.5">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    {car.seller.rating > 0 && (
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        <span className="font-medium">{car.seller.rating}.0</span>
                      </div>
                    )}
                    <div className="flex items-center text-green-600">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>2hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="space-y-2">
              <Button 
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 font-medium text-white h-10"
                onClick={handleMakeOffer}
              >
                Make an Offer
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-medium hover:bg-primary hover:text-white transition-all duration-300 h-9"
                  onClick={handleChat}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-medium hover:bg-secondary hover:text-white transition-all duration-300 h-9"
                >
                  Test Drive
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        car={car}
        onSubmit={handleOfferSubmit}
      />

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPSuccess}
        phoneNumber="+91 98765 43210"
        purpose="make an offer"
      />
    </>
  );
};

export default CarCard;
