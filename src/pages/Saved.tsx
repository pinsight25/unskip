
import { useState } from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import { mockCars } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import OfferModal from '@/components/modals/OfferModal';
import MobileOfferModal from '@/components/modals/MobileOfferModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Saved = () => {
  const [savedCarIds, setSavedCarIds] = useState(['1', '2', '3', '4']); // Mock saved car IDs
  const [selectedCar, setSelectedCar] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const savedCars = mockCars.filter(car => savedCarIds.includes(car.id));

  const handleUnsave = (carId: string) => {
    setSavedCarIds(prev => prev.filter(id => id !== carId));
    toast({
      title: "Removed from Saved",
      description: "Car removed from your wishlist",
    });
  };

  const handleMakeOffer = (car: any) => {
    setSelectedCar(car);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: any) => {
    toast({
      title: "Offer Submitted! 🎉",
      description: "Your offer has been sent to the seller.",
    });
    setShowOfferModal(false);
    setSelectedCar(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ResponsiveLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
          <div className="container mx-auto mobile-page-container-fixed">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Saved Cars</h1>
                <p className="text-base md:text-lg text-gray-600">
                  {savedCars.length} cars in your wishlist
                </p>
              </div>
              <Button variant="outline" className="self-center md:self-auto hover-lift">
                <Search className="h-4 w-4 mr-2" />
                Find Similar
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto mobile-page-container-fixed">
          <div className="max-w-7xl mx-auto">
            {savedCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedCars.map((car) => (
                  <Card key={car.id} className="overflow-hidden hover-lift cards-equal-height">
                    <div className="relative">
                      <img
                        src={car.images[0]}
                        alt={car.title}
                        className="w-full aspect-[4/3] object-cover"
                        loading="lazy"
                      />
                      <button 
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors touch-target"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnsave(car.id);
                        }}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">{car.title}</h3>
                      <p className="text-2xl font-bold text-orange-600 mb-2">{formatPrice(car.price)}</p>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{car.location}</p>
                      <Button 
                        size="default" 
                        className="w-full touch-target-button"
                        onClick={() => handleMakeOffer(car)}
                      >
                        Make Offer
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center max-w-md mx-auto">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No saved cars yet</h3>
                <p className="text-gray-600 mb-6">Start saving cars you're interested in to see them here</p>
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/'}
                  className="touch-target-button"
                >
                  Browse Cars
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {selectedCar && (
        <>
          {isMobile ? (
            <MobileOfferModal
              isOpen={showOfferModal}
              onClose={() => setShowOfferModal(false)}
              car={selectedCar}
              onSubmit={handleOfferSubmit}
            />
          ) : (
            <OfferModal
              isOpen={showOfferModal}
              onClose={() => setShowOfferModal(false)}
              car={selectedCar}
              onSubmit={handleOfferSubmit}
            />
          )}
        </>
      )}
    </ResponsiveLayout>
  );
};

export default Saved;
