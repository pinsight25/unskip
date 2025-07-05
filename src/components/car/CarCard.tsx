
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import { MapPin, Eye, Star, Shield, Calendar, Fuel, Settings, Heart, MessageCircle, Gauge, Clock } from 'lucide-react';
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
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 overflow-hidden w-full max-w-[350px] mx-auto">
        <CardContent className="p-0">
          {/* Image Section */}
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
                onClick={handleSave}
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

          {/* Content Section - Improved Spacing */}
          <div className="p-4 space-y-4">
            {/* Title & Price */}
            <div className="space-y-3">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="font-semibold text-lg leading-tight hover:text-orange-500 transition-colors line-clamp-2 text-gray-900">
                  {car.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-orange-500">
                  {formatPrice(car.price)}
                </p>
                {car.isRentAvailable && car.rentPrice && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Rent Available</p>
                    <p className="text-sm font-semibold text-green-600">₹{car.rentPrice.daily.toLocaleString('en-IN')}/day</p>
                  </div>
                )}
              </div>
            </div>

            {/* Car Specs - Better Spacing */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                  <Calendar className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-xs">{car.year}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                  <Gauge className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-xs">{(car.mileage/1000).toFixed(0)}k km</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                  <Fuel className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-xs">{car.fuelType}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                  <Settings className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-xs">{car.transmission}</span>
                </div>
              </div>
            </div>

            {/* Location - Better Spacing */}
            <div className="flex items-center text-gray-600 bg-orange-50 px-3 py-2 rounded-md">
              <MapPin className="h-3 w-3 mr-2 text-orange-500 flex-shrink-0" />
              <span className="font-medium text-xs">{car.location}</span>
            </div>

            {/* Seller Info - Improved Layout and Spacing */}
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-orange-600">
                    {car.seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900 truncate">{car.seller.name}</p>
                    {car.seller.verified && (
                      <Shield className="h-3 w-3 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    {car.seller.rating > 0 && (
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        <span className="font-medium">{car.seller.rating}.0</span>
                      </div>
                    )}
                    <div className="flex items-center text-green-600">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="font-medium">Active 2h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Better Spacing */}
            <div className="space-y-3 pt-2">
              <Button 
                size="sm"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-semibold text-white h-10 text-sm shadow-sm"
                onClick={handleMakeOffer}
              >
                Make an Offer
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 h-9 text-sm"
                  onClick={handleChat}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 h-9 text-sm"
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
