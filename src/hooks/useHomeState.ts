
import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

export const useHomeState = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    type: 'all',
    priceRange: [0, 5000000],
    location: ''
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

  const applyFilters = (filters: SearchFiltersType) => {
    let filtered = cars;
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(car => car.seller.type === filters.type);
    }
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query)
      );
    }
    
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

  const handleSort = (sortValue: string) => {
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
  };

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
          title: "Car saved to wishlist",
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
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (offer: { amount: number; message: string; buyerName: string; buyerPhone: string }) => {
    console.log('Offer submitted:', offer);
    toast({
      title: "Offer submitted!",
      description: "Your offer has been sent to the seller.",
    });
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Updated!",
        description: "Car listings have been refreshed.",
      });
    }, 1000);
  };

  // Sort by featured and verified first by default
  useEffect(() => {
    const sorted = [...cars].sort((a, b) => {
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
    handleFilterChange,
    handleTypeFilter,
    handleSort,
    handleSaveCar,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit,
    handlePullToRefresh
  };
};
