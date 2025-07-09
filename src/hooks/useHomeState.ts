import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
  city: string;
}

export const useHomeState = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [offerStatuses, setOfferStatuses] = useState<Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>>({});
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    type: 'all',
    priceRange: [0, 5000000],
    location: '',
    city: 'Chennai' // Default to Chennai
  });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // FUNCTIONAL SEARCH AND FILTERING
  const applyFilters = (filters: SearchFiltersType) => {
    let filtered = cars;
    
    // Filter by seller type - WORKING
    if (filters.type !== 'all') {
      filtered = filtered.filter(car => car.seller.type === filters.type);
    }
    
    // City filtering - Handle "all-cities" value
    if (filters.city && filters.city !== 'all-cities') {
      filtered = filtered.filter(car => 
        car.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    // Search functionality - WORKING
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query) ||
        car.seller.name.toLowerCase().includes(query)
      );
    }
    
    // Price range filtering
    filtered = filtered.filter(car => 
      car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
    );
    
    console.log(`Filtered ${filtered.length} cars from ${cars.length} total`);
    setFilteredCars(filtered);
  };

  const handleFilterChange = (filters: SearchFiltersType) => {
    setCurrentFilters(filters);
    applyFilters(filters);
  };

  const handleTypeFilter = (type: 'all' | 'dealer' | 'individual') => {
    const newFilters = { ...currentFilters, type };
    setCurrentFilters(newFilters);
    applyFilters(newFilters);
  };

  // FUNCTIONAL SORTING
  const handleSort = (sortValue: string) => {
    if (!sortValue) return;
    
    const sorted = [...filteredCars].sort((a, b) => {
      switch (sortValue) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'year_desc':
          return b.year - a.year;
        case 'mileage_asc':
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });
    setFilteredCars(sorted);
    toast({
      title: "Cars sorted",
      description: `Sorted by ${sortValue.replace('_', ' ')}`,
    });
  };

  // FUNCTIONAL SAVE/WISHLIST
  const handleSaveCar = (carId: string) => {
    setSavedCars(prev => {
      const isAlreadySaved = prev.includes(carId);
      if (isAlreadySaved) {
        toast({
          title: "Car removed from wishlist",
          description: "Car has been removed from your saved cars.",
        });
        return prev.filter(id => id !== carId);
      } else {
        toast({
          title: "Car saved to wishlist ❤️",
          description: "Car has been added to your saved cars.",
        });
        return [...prev, carId];
      }
    });
  };

  const handleMakeOffer = (car: Car) => {
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
    
    if (selectedCar) {
      // Set offer status to pending
      setOfferStatuses(prev => ({ ...prev, [selectedCar.id]: 'pending' }));
      
      // Simulate offer acceptance after 3 seconds
      setTimeout(() => {
        setOfferStatuses(prev => ({ ...prev, [selectedCar.id]: 'accepted' }));
        toast({
          title: "Offer Accepted! 🎉",
          description: "Great news! The seller has accepted your offer. You can now chat with them.",
        });
      }, 3000);
    }
    
    toast({
      title: "Offer submitted successfully! 🎉",
      description: "Your offer has been sent to the seller. They will contact you if interested.",
    });
    setShowOfferModal(false);
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Updated! ✨",
        description: "Car listings have been refreshed.",
      });
    }, 1000);
  };

  const getOfferStatus = (carId: string) => {
    return offerStatuses[carId] || 'none';
  };

  // Sort by featured and verified first by default
  useEffect(() => {
    const sorted = [...mockCars].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });
    setCars(sorted);
    setFilteredCars(sorted);
  }, []);

  return {
    cars,
    filteredCars,
    savedCars,
    currentFilters,
    showOfferModal,
    setShowOfferModal,
    showOTPModal,
    setShowOTPModal,
    selectedCar,
    isVerified,
    isRefreshing,
    isMobile,
    offerStatuses,
    handleFilterChange,
    handleTypeFilter,
    handleSort,
    handleSaveCar,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit,
    handlePullToRefresh,
    getOfferStatus
  };
};
