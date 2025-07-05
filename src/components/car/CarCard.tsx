
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import { MapPin, Eye, Star, Shield, Calendar, Fuel, Settings, Heart, Share2, MessageCircle, Gauge, Clock, CalendarDays } from 'lucide-react';
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
      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 overflow-hidden hover:scale-[1.02] shadow-lg">
        <CardContent className="p-0">
          {/* Enhanced Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Link to={`/car/${car.id}`}>
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
              />
            </Link>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Save Heart Icon - Enhanced */}
            <div className="absolute top-4 right-4">
              <Button 
                size="sm" 
                variant="secondary" 
                className={`h-12 w-12 p-0 shadow-lg rounded-full group-hover:scale-110 transition-all duration-300 ${
                  isSaved ? 'bg-red-50 hover:bg-red-100' : 'bg-white/90 hover:bg-white'
                }`}
                onClick={handleSave}
              >
                <Heart className={`h-5 w-5 transition-colors ${
                  isSaved ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                }`} />
              </Button>
            </div>
            
            {/* Enhanced Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {car.featured && (
                <Badge className="bg-amber-500/90 backdrop-blur-sm text-white border-0 font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                  ⭐ Featured
                </Badge>
              )}
              {car.verified && (
                <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                  <Shield className="h-4 w-4 mr-1" />
                  Verified
                </Badge>
              )}
              {car.isRentAvailable && (
                <Badge className="bg-blue-500/90 backdrop-blur-sm text-white border-0 font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                  Rent ₹{car.rentPrice?.daily.toLocaleString('en-IN')}/day
                </Badge>
              )}
            </div>

            {/* Views & Quick Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center font-semibold">
                <Eye className="h-4 w-4 mr-2" />
                {car.views}
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Button size="sm" variant="secondary" className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="p-8 space-y-6">
            {/* Title & Price - Enhanced Typography */}
            <div className="space-y-4">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="font-bold text-2xl leading-tight hover:text-primary transition-colors group-hover:text-primary line-clamp-2">
                  {car.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-black text-primary">
                  {formatPrice(car.price)}
                </p>
                {car.isRentAvailable && car.rentPrice && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Rent from</p>
                    <p className="text-lg font-bold text-secondary">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-base">
              <div className="flex items-center text-muted-foreground bg-secondary/5 p-4 rounded-xl">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <span className="font-bold">{car.year}</span>
              </div>
              <div className="flex items-center text-muted-foreground bg-secondary/5 p-4 rounded-xl">
                <Gauge className="h-5 w-5 mr-3 text-primary" />
                <span className="font-bold">{car.mileage.toLocaleString('en-IN')} km</span>
              </div>
              <div className="flex items-center text-muted-foreground bg-secondary/5 p-4 rounded-xl">
                <Fuel className="h-5 w-5 mr-3 text-primary" />
                <span className="font-bold">{car.fuelType}</span>
              </div>
              <div className="flex items-center text-muted-foreground bg-secondary/5 p-4 rounded-xl">
                <Settings className="h-5 w-5 mr-3 text-primary" />
                <span className="font-bold">{car.transmission}</span>
              </div>
            </div>

            {/* Location - Enhanced */}
            <div className="flex items-center text-muted-foreground bg-primary/5 p-4 rounded-xl">
              <MapPin className="h-5 w-5 mr-3 text-primary" />
              <span className="font-bold text-lg">{car.location}</span>
            </div>

            {/* Enhanced Seller Info */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {car.seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold">{car.seller.name}</p>
                    {car.seller.verified && (
                      <Badge className="bg-success/10 text-success border-success/20 text-sm px-3 py-1 rounded-full">
                        <Shield className="h-4 w-4 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    {car.seller.rating > 0 && (
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < car.seller.rating ? 'fill-current' : ''}`} />
                        ))}
                        <span className="font-semibold ml-2 text-foreground text-base">{car.seller.rating}.0</span>
                      </div>
                    )}
                    <div className="flex items-center text-green-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="font-semibold">Responds in 2 hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold text-white hover:shadow-lg transition-all duration-300 h-14 text-lg"
                onClick={handleMakeOffer}
              >
                Make an Offer
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-semibold hover:bg-primary hover:text-white transition-all duration-300 h-12 text-base"
                  onClick={handleChat}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-semibold hover:bg-secondary hover:text-white transition-all duration-300 h-12 text-base"
                >
                  <CalendarDays className="h-5 w-5 mr-2" />
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
