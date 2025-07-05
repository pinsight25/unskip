
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
          {/* Standardized Image Section */}
          <div className="relative w-full h-[240px] overflow-hidden">
            <Link to={`/car/${car.id}`}>
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </Link>
            
            {/* Consistent Badge Positioning */}
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

            {/* Consistent Save Button */}
            <div className="absolute top-3 right-3">
              <Button 
                size="sm" 
                variant="secondary" 
                className={`h-9 w-9 p-0 shadow-md rounded-full border ${
                  isSaved ? 'bg-red-50 hover:bg-red-100 border-red-200' : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
                onClick={handleSave}
              >
                <Heart className={`h-4 w-4 transition-colors ${
                  isSaved ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
                }`} />
              </Button>
            </div>

            {/* Consistent Views Badge */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center font-medium">
                <Eye className="h-3 w-3 mr-1" />
                {car.views}
              </div>
            </div>
          </div>

          {/* Standardized Content Section */}
          <div className="p-4 space-y-4">
            {/* Consistent Title & Price Layout */}
            <div className="space-y-2">
              <Link to={`/car/${car.id}`} className="block">
                <h3 className="font-medium text-[18px] leading-tight hover:text-orange-500 transition-colors line-clamp-2 text-gray-900 h-[48px] flex items-start">
                  {car.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-[24px] font-bold text-orange-500">
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

            {/* Standardized Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                <Calendar className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-[14px]">{car.year}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                <Gauge className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-[14px]">{(car.mileage/1000).toFixed(0)}k km</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                <Fuel className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-[14px]">{car.fuelType}</span>
              </div>
              <div className="flex items-center text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                <Settings className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                <span className="font-medium text-[14px]">{car.transmission}</span>
              </div>
            </div>

            {/* Consistent Location */}
            <div className="flex items-center text-gray-600 bg-orange-50 p-2.5 rounded-lg">
              <MapPin className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
              <span className="font-medium text-[14px]">{car.location}</span>
            </div>

            {/* Standardized Seller Info */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">
                    {car.seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-[16px] text-gray-900 truncate">{car.seller.name}</p>
                    {car.seller.verified && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5 flex-shrink-0">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-[14px] text-gray-500 gap-3">
                    {car.seller.rating > 0 && (
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        <span className="font-medium">{car.seller.rating}.0</span>
                      </div>
                    )}
                    <div className="flex items-center text-green-600">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="font-medium">Active 2hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standardized Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                size="default"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-semibold text-white h-[40px] text-[15px] shadow-sm"
                onClick={handleMakeOffer}
              >
                Make an Offer
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="default"
                  className="font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 h-[36px] text-[14px]"
                  onClick={handleChat}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="default"
                  className="font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 h-[36px] text-[14px]"
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
