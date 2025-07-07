
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { mockAccessories } from '@/data/accessoryMockData';
import { Car } from '@/types/car';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import TestDriveModal from '@/components/modals/TestDriveModal';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import CarImageGallery from '@/components/car/CarImageGallery';
import CarOverview from '@/components/car/CarOverview';
import CarSpecifications from '@/components/car/CarSpecifications';
import SellerCard from '@/components/car/SellerCard';
import CarActions from '@/components/car/CarActions';
import AccessoryCard from '@/components/accessories/AccessoryCard';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { navigateToChat } = useChatManager();
  const car: Car | undefined = mockCars.find((car) => car.id === id);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [offerStatus, setOfferStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none');
  const { toast } = useToast();

  if (!car) {
    return (
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
            <p className="text-gray-600">Sorry, the car you are looking for could not be found.</p>
            <Link to="/" className="text-blue-500">Go back to homepage</Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // Get recommended accessories for this car
  const recommendedAccessories = mockAccessories
    .filter(accessory => 
      accessory.compatibility.some(model => 
        model.toLowerCase().includes(car.brand.toLowerCase()) ||
        model.toLowerCase().includes(car.model.toLowerCase())
      ) || accessory.compatibility.includes('Universal fit - All cars')
    )
    .slice(0, 6);

  const handleMakeOffer = () => {
    if (!isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOfferModal(true);
    }
  };

  const handleOTPSuccess = () => {
    setIsVerified(true);
    setShowOTPModal(false);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
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
    setShowOfferModal(false);
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
      navigateToChat(car.id);
    }
  };

  const handleTestDrive = () => {
    toast({
      title: "Test Drive Request",
      description: `Test drive request sent for ${car.title}`,
    });
    console.log('Test drive requested for car:', car.id);
    setShowTestDriveModal(true);
  };

  const handleTestDriveScheduled = (booking: any) => {
    toast({
      title: "Test Drive Scheduled! 🚗",
      description: `Your test drive is confirmed for ${booking.date} at ${booking.timeSlot}`,
    });
  };

  return (
    <ResponsiveLayout>
      <div className="desktop-page-container pb-32 md:pb-6">
        <CarImageGallery
          images={car.images}
          title={car.title}
          featured={car.featured}
          verified={car.verified}
        />

        {/* Car Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 grid-gap-standard desktop-content-spacing">
          {/* Left Column - Car Overview */}
          <div>
            <CarOverview
              title={car.title}
              price={car.price}
              rentPrice={car.rentPrice}
              description={car.description}
            />

            <CarSpecifications
              year={car.year}
              transmission={car.transmission}
              fuelType={car.fuelType}
              location={car.location}
              seller={car.seller}
            />
          </div>

          {/* Right Column - Seller & Actions */}
          <div>
            <SellerCard seller={car.seller} />

            {/* Actions Section with extra bottom padding on mobile */}
            <div className="mb-8 md:mb-0">
              <CarActions
                offerStatus={offerStatus}
                onMakeOffer={handleMakeOffer}
                onChatClick={handleChatClick}
                onTestDrive={handleTestDrive}
              />
            </div>
          </div>
        </div>

        {/* Recommended Accessories Section */}
        {recommendedAccessories.length > 0 && (
          <div className="desktop-header-section border-t border-gray-200 pt-8 md:pt-12">
            <div className="desktop-content-spacing">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                ✨ Recommended Accessories
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Popular upgrades for {car.brand} {car.model}
              </p>
            </div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="md:hidden">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {recommendedAccessories.map((accessory) => (
                  <div key={accessory.id} className="flex-shrink-0 w-64">
                    <AccessoryCard accessory={accessory} viewMode="grid" />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-gap-standard">
              {recommendedAccessories.map((accessory) => (
                <AccessoryCard key={accessory.id} accessory={accessory} viewMode="grid" />
              ))}
            </div>

            <div className="mt-6 md:mt-8 text-center">
              <Link to={`/accessories?search=${car.brand} ${car.model}`}>
                <button className="text-primary hover:text-primary/80 font-medium text-base md:text-lg">
                  View all accessories for {car.brand} {car.model} →
                </button>
              </Link>
            </div>
          </div>
        )}
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
