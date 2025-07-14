import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { useCity } from '@/contexts/CityContext';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
  city: string;
}

export const useHomeState = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [offerStatuses, setOfferStatuses] = useState<Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>>({});
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    type: 'all',
    priceRange: [0, Infinity],
    location: '',
    city: ''
  });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const { selectedCity } = useCity();

  // React Query: fetch cars
  const {
    data: cars = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      let { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select(`
          *,
          car_images!inner (image_url, is_cover),
          users:seller_id (id, name, is_verified, user_type)
        `)
        .eq('status', 'active')
        .eq('car_images.is_cover', true)
        .order('created_at', { ascending: false });
      if (carsError) throw new Error('Failed to load cars');
      const dealerSellerIds = (carsData || [])
        .filter((car: any) => car.users?.user_type === 'dealer')
        .map((car: any) => car.seller_id);
      let dealersMap: Record<string, { verified: boolean; verification_status: string }> = {};
      if (dealerSellerIds.length > 0) {
        const { data: dealersData, error: dealersError } = await supabase
          .from('dealers')
          .select('user_id, verified, verification_status')
          .in('user_id', dealerSellerIds);
        if (!dealersError && Array.isArray(dealersData)) {
          dealersData.forEach((dealer: any) => {
            dealersMap[dealer.user_id] = {
              verified: dealer.verified,
              verification_status: dealer.verification_status
            };
          });
        }
      }
      const carsMapped: Car[] = (carsData || []).map((car: any) => {
        const isDealer = car.users?.user_type === 'dealer';
        const dealerInfo = isDealer ? dealersMap[car.seller_id] : undefined;
        return {
          id: car.id,
          title: `${car.year} ${car.make} ${car.model}`,
          brand: car.make,
          make: car.make,
          model: car.model,
          variant: car.variant,
          year: car.year,
          price: car.price,
          images: Array.isArray(car.car_images) && car.car_images.length > 0
            ? car.car_images.map((img: any) => img.image_url)
            : [],
          mileage: car.kilometers_driven || 0,
          kilometersDriven: car.kilometers_driven || 0,
          fuelType: car.fuel_type,
          transmission: car.transmission,
          ownership: car.number_of_owners || 1,
          ownershipNumber: car.number_of_owners || 1,
          location: [car.area, car.city].filter(Boolean).join(', '),
          description: car.description || '',
          seller: {
            id: car.seller_id || '',
            name: car.users?.name || 'Individual Seller',
            type: isDealer ? 'dealer' : 'individual',
            phone: '',
            email: '',
            verified: car.verified || false, // legacy, not used for dealer badge
            dealerVerified: isDealer ? (dealerInfo?.verified === true) : undefined,
            rating: 0,
            totalSales: 0,
            memberSince: car.created_at ? new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A',
            avatar: '',
            businessName: '',
            location: [car.area, car.city].filter(Boolean).join(', '),
          },
          color: car.color,
          landmark: car.landmark,
          seatingCapacity: car.seating_capacity,
          isRentAvailable: car.is_rent_available || false,
          rentPrice: car.daily_rate ? { daily: car.daily_rate, weekly: car.weekly_rate || 0 } : undefined,
          rentPolicies: undefined,
          verified: car.verified === true || false,
          featured: car.featured === true || false,
          views: car.views || 0,
          createdAt: car.created_at,
          registrationYear: car.registration_year,
          registrationState: car.registration_state,
          fitnessCertificateValidTill: car.fitness_certificate_valid_till,
          noAccidentHistory: car.no_accident_history,
          acceptOffers: car.accept_offers,
          offerPercentage: car.offer_percentage,
          insuranceValid: car.insurance_valid,
          insuranceType: car.insurance_type,
          lastServiceDate: car.last_service_date,
          serviceCenterType: car.service_center_type,
          serviceAtAuthorized: car.authorized_service_center,
          rtoTransferSupport: car.rto_transfer_support,
          insurance: undefined,
          serviceHistory: undefined,
          seller_type: car.users?.user_type || 'individual',
        };
      });
      return carsMapped;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  useEffect(() => {
    let filtered = cars;
    if (currentFilters.type !== 'all') {
      filtered = filtered.filter(car => car.seller.type === currentFilters.type);
    }
    if (currentFilters.city) {
      filtered = filtered.filter(car =>
        car.location.toLowerCase().includes(currentFilters.city.toLowerCase())
      );
    }
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(car =>
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query) ||
        car.seller.name.toLowerCase().includes(query)
      );
    }
    filtered = filtered.filter(car => {
      const min = currentFilters.priceRange[0] ?? 0;
      const max = currentFilters.priceRange[1] ?? Infinity;
      return car.price >= min && car.price <= max;
    });
    setFilteredCars(filtered);
  }, [cars, currentFilters]);

  useEffect(() => {
    if (selectedCity && currentFilters.city !== selectedCity) {
      setCurrentFilters(prev => {
        if (prev.city !== selectedCity) {
          return { ...prev, city: selectedCity };
        }
        return prev;
      });
    }
  }, [selectedCity]);

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

  // For pull-to-refresh, use refetch from React Query
  const handlePullToRefresh = () => {
    refetch();
  };

  const getOfferStatus = (carId: string) => {
    return offerStatuses[carId] || 'none';
  };

  return {
    filteredCars,
    savedCars,
    currentFilters,
    showOfferModal,
    setShowOfferModal,
    showOTPModal,
    setShowOTPModal,
    selectedCar,
    isMobile,
    isRefreshing: isFetching,
    loading: isLoading,
    offerStatuses,
    handleFilterChange: (filters: SearchFiltersType) => setCurrentFilters(filters),
    handleTypeFilter: (type: 'all' | 'dealer' | 'individual') => setCurrentFilters(f => ({ ...f, type })),
    handleSort,
    handleSaveCar,
    handleMakeOffer,
    handleOTPSuccess,
    handleOfferSubmit,
    handlePullToRefresh,
    getOfferStatus
  };
};
