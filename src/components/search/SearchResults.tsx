
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { useOfferFlow } from '@/hooks/useOfferFlow';
import HomeModals from '@/components/home/HomeModals';
import { useToast } from '@/hooks/use-toast';

interface SearchResultsProps {
  cars: Car[];
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SearchResults = ({ cars, sortBy, onSortChange }: SearchResultsProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [offerStatuses, setOfferStatuses] = useState<Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>>({});
  
  const { toast } = useToast();
  
  const {
    selectedCar,
    showOfferModal,
    showOTPModal,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit,
    closeModals
  } = useOfferFlow();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSaveCar = (carId: string) => {
    setSavedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const getOfferStatus = (carId: string): 'none' | 'pending' | 'accepted' | 'rejected' => {
    return offerStatuses[carId] || 'none';
  };

  const handleOfferSubmitWithStatus = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    if (selectedCar) {
      // Update offer status to pending
      setOfferStatuses(prev => ({
        ...prev,
        [selectedCar.id]: 'pending'
      }));
      
      // Simulate seller response after a delay
      setTimeout(() => {
        setOfferStatuses(prev => ({
          ...prev,
          [selectedCar.id]: Math.random() > 0.3 ? 'accepted' : 'rejected'
        }));
      }, 3000);
    }
    
    handleOfferSubmit(offer);
  };

  const handleChatClick = (car: Car) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (status === 'accepted') {
      toast({
        title: "Chat Available",
        description: "Your offer was accepted! You can now chat with the seller.",
      });
    }
  };

  const handleTestDriveClick = (car: Car) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer first to schedule a test drive.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Wait for seller response",
        description: "Please wait for the seller to respond to your offer before scheduling a test drive.",
      });
      return;
    }
    
    if (status === 'accepted') {
      toast({
        title: "Test Drive Scheduled!",
        description: `Test drive scheduled for ${booking.date} at ${booking.timeSlot}`,
      });
    }
    
    if (status === 'rejected') {
      toast({
        title: "Offer was rejected",
        description: "Please make a new offer before scheduling a test drive.",
        variant: "destructive",
      });
    }
  };

  const handleTestDriveScheduled = (booking: any) => {
    toast({
      title: "Test Drive Scheduled!",
      description: `Test drive scheduled for ${booking.date} at ${booking.timeSlot}`,
    });
  };

  return (
    <div className="w-full">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Search Results</h2>
          <p className="text-gray-600">{cars.length} cars found</p>
        </div>
        
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full sm:w-auto bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-w-[180px] shadow-sm"
        >
          <option value="">Sort by: Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest First</option>
          <option value="mileage_asc">Mileage: Best First</option>
        </select>
      </div>
      
      {/* Search Results Content */}
      {cars.length > 0 ? (
        <div className="w-full">
          {isMobile ? (
            <div className="space-y-4">
              {cars.map((car) => (
                <MobileCarCard 
                  key={car.id} 
                  car={car} 
                  onSave={() => handleSaveCar(car.id)}
                  isSaved={savedCars.includes(car.id)}
                  onMakeOffer={() => handleMakeOffer(car)}
                  onChat={() => handleChatClick(car)}
                  onTestDrive={() => handleTestDriveClick(car)}
                  offerStatus={getOfferStatus(car.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  onSave={() => handleSaveCar(car.id)}
                  isSaved={savedCars.includes(car.id)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No cars found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Button onClick={() => window.location.reload()}>Clear All Filters</Button>
        </div>
      )}

      {/* Modals */}
      <HomeModals
        selectedCar={selectedCar}
        showOfferModal={showOfferModal}
        showOTPModal={showOTPModal}
        isMobile={isMobile}
        onCloseOfferModal={closeModals}
        onCloseOTPModal={closeModals}
        onOTPSuccess={handleOTPSuccess}
        onOfferSubmit={handleOfferSubmitWithStatus}
      />
    </div>
  );
};

export default SearchResults;
