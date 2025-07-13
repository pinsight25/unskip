import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import { useToast } from '@/hooks/use-toast';
import { useCity } from '@/contexts/CityContext';
import { supabase } from '@/lib/supabase';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
  city: string;
}

export const useHomeState = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [offerStatuses, setOfferStatuses] = useState<Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>>({});
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    type: 'all',
    priceRange: [0, Infinity], // No upper bound by default
    location: '',
    city: ''
  });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Ensure loading starts as true
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const { toast } = useToast();
  const { selectedCity } = useCity();

  // Debug: log component mount/unmount
  useEffect(() => {
    return () => {
    };
  }, []);

  // Debug: log state
  useEffect(() => {
  }, [isLoading, cars, error]);

  // Fetch cars with race condition protection
  useEffect(() => {
    let mounted = true;
    const fetchCars = async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);
        setShowSkeleton(!hasFetchedOnce);
        setError(null);

        // Step 1: Fetch cars with seller info only
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

        if (!mounted) return;

        if (carsError) {
          setError('Failed to load cars');
          setCars([]);
          setFilteredCars([]);
        } else {
          // Step 2: Collect all dealer seller_ids
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
          // Step 3: Map to Car[] type, merging dealer info
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
            };
          });
          setCars(carsMapped);
          setFilteredCars(carsMapped);
        }
      } catch (err) {
        setError('Failed to load cars');
        setCars([]);
        setFilteredCars([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setHasFetchedOnce(true);
          setShowSkeleton(false);
        }
      }
    };

    // Only fetch on first mount or explicit refresh
    if (!hasFetchedOnce) {
      const timer = setTimeout(() => {
        fetchCars();
      }, 100);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [hasFetchedOnce]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update filters when city changes from header
  useEffect(() => {
    const newFilters = { ...currentFilters, city: selectedCity };
    setCurrentFilters(newFilters);
    applyFilters(newFilters);
  }, [selectedCity]);

  // FUNCTIONAL SEARCH AND FILTERING
  const applyFilters = (filters: SearchFiltersType) => {
    let filtered = cars;
    
    // Filter by seller type - WORKING
    if (filters.type !== 'all') {
      filtered = filtered.filter(car => car.seller.type === filters.type);
    }
    
    // City filtering - Use selected city from context
    if (filters.city) {
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
    
    // Price range filtering (only apply if user sets a bound)
    filtered = filtered.filter(car => {
      const min = filters.priceRange[0] ?? 0;
      const max = filters.priceRange[1] ?? Infinity;
      return car.price >= min && car.price <= max;
    });
    
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
    let mounted = true;
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        setShowSkeleton(!hasFetchedOnce);
        setError(null);
        // Simple query first (no join)
        let { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('status', 'active')
          .limit(10);
        // If simple query works, try the join
        if (!error && data && data.length > 0) {
          // Now try with join
          const joinResult = await supabase
            .from('cars')
            .select(`
              *,
              car_images!inner (image_url, is_cover)
            `)
            .eq('status', 'active')
            .eq('car_images.is_cover', true)
            .order('created_at', { ascending: false });
          if (!joinResult.error && joinResult.data && joinResult.data.length > 0) {
            data = joinResult.data;
            error = null;
          } else {
            // console.warn('Join fetch failed, using simple data.'); // Removed console.warn
          }
        }
        if (!mounted) return;
        if (error) {
          setError('Failed to load cars');
          setCars([]);
          setFilteredCars([]);
        } else {
          // Always map to Car[] type
          const carsMapped: Car[] = (data || []).map((car: any) => ({
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
              name: car.seller_name || 'Individual Seller',
              type: 'individual',
              phone: car.seller_phone || '',
              email: car.seller_email || '',
              verified: car.verified || false,
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
            insuranceValidTill: car.insurance_valid_till,
            insuranceType: car.insurance_type,
            lastServiceDate: car.last_service_date,
            serviceCenterType: car.service_center_type,
            serviceAtAuthorized: car.authorized_service_center,
            rtoTransferSupport: car.rto_transfer_support,
            insurance: undefined,
            serviceHistory: undefined,
          }));
          setCars(carsMapped);
          setFilteredCars(carsMapped);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load cars');
        setCars([]);
        setFilteredCars([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsRefreshing(false);
          setShowSkeleton(false);
        }
      }
    };
    fetchCars();
    return () => { mounted = false; };
  };

  const getOfferStatus = (carId: string) => {
    return offerStatuses[carId] || 'none';
  };

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
    isLoading,
    showSkeleton,
    error,
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
