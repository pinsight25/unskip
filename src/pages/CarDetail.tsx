
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import TestDriveModal from '@/components/modals/TestDriveModal';
import { Calendar, Fuel, MapPin, MessageCircle, RotateCcw, Settings, Star, Users, Shield, Award, DollarSign, CalendarDays } from 'lucide-react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useToast } from '@/hooks/use-toast';
import { formatIndianPrice } from '@/utils/priceFormatter';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const car: Car | undefined = mockCars.find((car) => car.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [offerMade, setOfferMade] = useState(false);
  const [offerStatus, setOfferStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const { toast } = useToast();

  if (!car) {
    return (
      <ResponsiveLayout>
        <div className="pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
              <p className="text-gray-600">Sorry, the car you are looking for could not be found.</p>
              <Link to="/" className="text-blue-500">Go back to homepage</Link>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (direction === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleMakeOffer = () => {
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleOTPSuccess = () => {
    setIsVerified(true);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
    setOfferMade(true);
    setOfferStatus('pending');
    
    // Simulate offer acceptance after 3 seconds
    setTimeout(() => {
      setOfferStatus('accepted');
      toast({
        title: "Offer Accepted! 🎉",
        description: "Great news! The seller has accepted your offer. You can now chat with them.",
      });
    }, 3000);

    toast({
      title: "Offer submitted!",
      description: "Your offer has been sent to the seller.",
    });
  };

  const handleChatClick = () => {
    if (offerStatus === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (offerStatus === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (offerStatus === 'accepted') {
      // Navigate to chat - in real app, this would be the actual chat ID
      navigate('/chat/1');
    }
  };

  const getChatButtonText = () => {
    switch (offerStatus) {
      case 'none':
        return 'Make offer to chat';
      case 'pending':
        return 'Waiting for response';
      case 'accepted':
        return 'Chat with seller';
      case 'rejected':
        return 'Offer rejected';
      default:
        return 'Chat';
    }
  };

  const handleTestDriveScheduled = (booking: any) => {
    toast({
      title: "Test Drive Scheduled! 🚗",
      description: `Your test drive is confirmed for ${booking.date} at ${booking.timeSlot}`,
    });
  };

  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20">
        <div className="container mx-auto px-4">
          {/* Car Image Gallery */}
          <div className="relative mb-6">
            <div 
              className="relative h-64 md:h-96 bg-gray-100 overflow-hidden rounded-lg"
              onTouchStart={(e) => {
                const touchStart = e.touches[0].clientX;
                const handleTouchEnd = (endEvent: TouchEvent) => {
                  const touchEnd = endEvent.changedTouches[0].clientX;
                  const diff = touchStart - touchEnd;
                  if (Math.abs(diff) > 50) {
                    handleImageSwipe(diff > 0 ? 'right' : 'left');
                  }
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <img 
                src={car.images[currentImageIndex]} 
                alt={car.title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {car.featured && (
                  <Badge className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {car.verified && (
                  <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Image Dots */}
              {car.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {car.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Image Navigation Arrows - Desktop Only */}
            <div className="hidden md:flex absolute top-1/2 transform -translate-y-1/2 w-full justify-between px-4">
              <button 
                onClick={() => handleImageSwipe('left')}
                className="bg-white/70 hover:bg-white rounded-full p-2"
                disabled={currentImageIndex === 0}
              >
                <RotateCcw className="h-6 w-6" />
              </button>
              <button 
                onClick={() => handleImageSwipe('right')}
                className="bg-white/70 hover:bg-white rounded-full p-2"
                disabled={currentImageIndex === car.images.length - 1}
              >
                <RotateCcw className="h-6 w-6 transform rotate-180" />
              </button>
            </div>
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Car Overview */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{car.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">{formatIndianPrice(car.price)}</span>
                {car.rentPrice && (
                  <span className="text-sm text-gray-500">
                    or ₹{car.rentPrice.daily.toLocaleString()}/day
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="h-4 w-4" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>5 Seats</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{car.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    {car.seller.rating && (
                      <>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700 font-medium">{car.seller.rating}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{car.description}</p>
            </div>

            {/* Right Column - Seller & Actions */}
            <div>
              <Card className="mb-6">
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-3">Seller Information</h4>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-700 font-semibold">{car.seller.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium">{car.seller.name}</p>
                      <p className="text-sm text-gray-500">Member since March 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      {car.seller.rating && (
                        <>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-700 font-medium">{car.seller.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={handleMakeOffer}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Make an Offer
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={handleChatClick}
                    disabled={offerStatus === 'pending' || offerStatus === 'rejected'}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {getChatButtonText()}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowTestDriveModal(true)}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Test Drive
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <TestDriveModal
        isOpen={showTestDriveModal}
        onClose={() => setShowTestDriveModal(false)}
        car={car}
        onScheduled={handleTestDriveScheduled}
      />
    </ResponsiveLayout>
  );
};

export default CarDetail;
