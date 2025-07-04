
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import TestDriveModal from '@/components/modals/TestDriveModal';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useToast } from '@/hooks/use-toast';
import CarImageGallery from '@/components/car/CarImageGallery';
import CarOverview from '@/components/car/CarOverview';
import CarSpecifications from '@/components/car/CarSpecifications';
import SellerCard from '@/components/car/SellerCard';
import CarActions from '@/components/car/CarActions';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const car: Car | undefined = mockCars.find((car) => car.id === id);
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
          <CarImageGallery
            images={car.images}
            title={car.title}
            featured={car.featured}
            verified={car.verified}
          />

          {/* Car Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <CarActions
                offerStatus={offerStatus}
                onMakeOffer={handleMakeOffer}
                onChatClick={handleChatClick}
                onTestDrive={() => setShowTestDriveModal(true)}
              />
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
