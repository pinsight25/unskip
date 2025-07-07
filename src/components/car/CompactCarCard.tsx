
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import { useToast } from '@/hooks/use-toast';

interface CompactCarCardProps {
  car: Car;
  onSave?: (carId: string) => void;
  isSaved?: boolean;
}

const CompactCarCard = ({ car, onSave, isSaved = false }: CompactCarCardProps) => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const handleMakeOffer = () => {
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    toast({
      title: "Offer Submitted",
      description: "Your offer has been sent to the seller.",
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const calculateEMI = (price: number) => {
    const emi = Math.round(price * 0.02);
    return `₹${emi.toLocaleString()}/m*`;
  };

  const formatMileage = (mileage: number) => {
    if (mileage >= 1000) {
      return `${Math.round(mileage / 1000)}k km`;
    }
    return `${mileage} km`;
  };

  return (
    <>
      <Card className="group overflow-hidden w-full max-w-[320px] mx-auto hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Section - Reduced height */}
          <div className="relative aspect-[4/2.5] overflow-hidden">
            <Link to={`/car/${car.id}`}>
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            {/* Heart Button */}
            <button
              onClick={handleSave}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </button>

            {/* Badges - Smaller */}
            <div className="absolute top-2 left-2 flex gap-1">
              {car.featured && (
                <Badge className="bg-orange-500 text-white text-xs px-1.5 py-0.5 h-5">
                  <Award className="h-2.5 w-2.5 mr-1" />
                  Featured
                </Badge>
              )}
              {car.verified && (
                <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5 h-5">
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  Verified
                </Badge>
              )}
              {car.isRentAvailable && (
                <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 h-5">
                  Rent Available
                </Badge>
              )}
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col space-y-2">
            {/* Title */}
            <Link to={`/car/${car.id}`} className="block">
              <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                {car.year} {car.title}
              </h3>
            </Link>

            {/* Price and EMI */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(car.price)}
              </span>
              <span className="text-xs text-gray-500">
                EMI {calculateEMI(car.price)}
              </span>
            </div>

            {/* Single Row Specs */}
            <div className="text-xs text-gray-600">
              {formatMileage(car.mileage)} • {car.fuelType} • {car.transmission} • {car.location.split(',')[0]}
            </div>

            {/* Seller Info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-700">
                <span className="font-medium">{car.seller.name}</span>
                <span className="text-gray-500">•</span>
                <span>{car.seller.type === 'dealer' ? 'Dealer' : 'Individual'}</span>
              </div>
              {car.seller.rating && (
                <span className="text-gray-600 font-medium">
                  {car.seller.rating}★
                </span>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <Button 
                size="sm"
                className="w-full h-8 text-sm"
                onClick={handleMakeOffer}
              >
                Make an Offer
              </Button>
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

export default CompactCarCard;
