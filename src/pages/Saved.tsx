
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import OfferModal from '@/components/modals/OfferModal';
import OTPModal from '@/components/modals/OTPModal';
import { useToast } from '@/hooks/use-toast';

const Saved = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [savedCars] = useState([
    {
      id: '1',
      title: '2022 Maruti Swift VXI',
      price: 650000,
      location: 'Mumbai, Maharashtra',
      images: ['/placeholder.svg'],
      year: 2022,
      transmission: 'Manual',
      fuelType: 'Petrol',
      mileage: 25000,
      seller: { name: 'John Doe', type: 'individual' as const }
    },
    {
      id: '2',
      title: '2021 Hyundai i20 Sportz',
      price: 750000,
      location: 'Mumbai, Maharashtra',
      images: ['/placeholder.svg'],
      year: 2021,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 18000,
      seller: { name: 'CarMax Dealers', type: 'dealer' as const }
    },
    {
      id: '3',
      title: '2023 Tata Nexon EV',
      price: 1400000,
      location: 'Mumbai, Maharashtra',
      images: ['/placeholder.svg'],
      year: 2023,
      transmission: 'Automatic',
      fuelType: 'Electric',
      mileage: 5000,
      seller: { name: 'Auto Plaza', type: 'dealer' as const }
    },
    {
      id: '4',
      title: '2022 MG Hector Plus',
      price: 1650000,
      location: 'Mumbai, Maharashtra',
      images: ['/placeholder.svg'],
      year: 2022,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 12000,
      seller: { name: 'Raj Kumar', type: 'individual' as const }
    }
  ]);

  // Modal states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMakeOffer = (car: any) => {
    setSelectedCar(car);
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
    toast({
      title: "Offer submitted successfully! 🎉",
      description: "Your offer has been sent to the seller. They will contact you if interested.",
    });
    setShowOfferModal(false);
  };

  const handleChat = (car: any) => {
    toast({
      title: "Chat Feature",
      description: "Chat functionality will be available after making an offer.",
    });
  };

  const handleView = (car: any) => {
    navigate(`/car/${car.id}`);
  };

  const handleRemoveFromSaved = (carId: string) => {
    toast({
      title: "Car removed from saved list",
      description: "The car has been removed from your wishlist.",
    });
  };

  const handleFindSimilar = () => {
    navigate('/search');
    toast({
      title: "Finding similar cars...",
      description: "Redirecting to search with similar recommendations.",
    });
  };

  return (
    <ResponsiveLayout>
      <div className="mobile-page-container-fixed mobile-content-safe">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Saved Cars</h1>
              <p className="text-gray-600">{savedCars.length} cars in your wishlist</p>
            </div>
            <Button variant="outline" onClick={handleFindSimilar}>
              <Search className="h-4 w-4 mr-2" />
              Find Similar
            </Button>
          </div>

          {savedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedCars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-200"></div>
                    <button 
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center"
                      onClick={() => handleRemoveFromSaved(car.id)}
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{car.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">{formatPrice(car.price)}</p>
                    <p className="text-gray-600 text-sm mb-3">{car.location}</p>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleMakeOffer(car)}
                      >
                        Make Offer
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleChat(car)}
                        >
                          Chat
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleView(car)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No saved cars yet</h3>
              <p className="text-gray-600 mb-6">Start saving cars you're interested in to see them here</p>
              <Button onClick={() => navigate('/search')}>Browse Cars</Button>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedCar && (
        <>
          <OfferModal
            isOpen={showOfferModal}
            onClose={() => setShowOfferModal(false)}
            car={selectedCar}
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
      )}
    </ResponsiveLayout>
  );
};

export default Saved;
