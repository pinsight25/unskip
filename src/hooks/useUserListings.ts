
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface CarListing {
  id: string;
  title: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  city: string;
  views: number;
  status: string;
  created_at: string;
  // All other car fields for editing/duplicating
  registrationYear?: number;
  registrationState?: string;
  fitnessCertificateValidTill?: string;
  numberOfOwners?: number;
  seatingCapacity?: number;
  fuelType?: string;
  transmission?: string;
  kilometersDriven?: number;
  color?: string;
  acceptOffers?: boolean;
  offerPercentage?: number;
  insuranceValidTill?: string;
  insuranceType?: string;
  insuranceValid?: boolean;
  lastServiceDate?: string;
  serviceCenterType?: string;
  serviceHistory?: boolean;
  authorizedServiceCenter?: boolean;
  rtoTransferSupport?: boolean;
  noAccidentHistory?: boolean;
  isRentAvailable?: boolean;
  dailyRate?: number;
  weeklyRate?: number;
  securityDeposit?: number;
  area?: string;
  landmark?: string;
  description?: string;
}

interface AccessoryListing {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_min: number;
  price_max: number;
  location: string;
  views: number;
  status: string;
  created_at: string;
  type: 'accessory';
  // Convert for compatibility
  price: { min: number; max: number };
  postedDate: string;
}

interface UserStats {
  totalCars: number;
  activeCars: number;
  totalAccessories: number;
  activeAccessories: number;
  totalViews: number;
}

export const useUserListings = () => {
  const { user } = useUser();
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [accessoryListings, setAccessoryListings] = useState<AccessoryListing[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCars: 0,
    activeCars: 0,
    totalAccessories: 0,
    activeAccessories: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const fetchUserListings = async () => {
    if (!user?.phone) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, get the user ID from the users table using phone
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', user.phone)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user:', userError);
        setError('Failed to fetch user data');
        return;
      }

      const userId = userData.id;

      // Fetch user's cars
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (carsError) {
        console.error('Error fetching cars:', carsError);
        setError('Failed to fetch car listings');
        return;
      }

      // Fetch user's accessories
      const { data: accessoriesData, error: accessoriesError } = await supabase
        .from('accessories')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (accessoriesError) {
        console.error('Error fetching accessories:', accessoriesError);
        setError('Failed to fetch accessory listings');
        return;
      }

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_listing_stats', { user_uuid: userId });

      if (statsError) {
        console.error('Error fetching stats:', statsError);
      }

      // Transform cars data
      const transformedCars: CarListing[] = (carsData || []).map(car => ({
        id: car.id,
        title: car.title || `${car.make} ${car.model}`,
        make: car.make,
        model: car.model,
        variant: car.variant || '',
        year: car.year,
        price: Number(car.price),
        city: car.city,
        views: car.views || 0,
        status: car.status || 'active',
        created_at: car.created_at,
        registrationYear: car.registration_year,
        registrationState: car.registration_state,
        fitnessCertificateValidTill: car.fitness_certificate_valid_till,
        numberOfOwners: car.number_of_owners,
        seatingCapacity: car.seating_capacity,
        fuelType: car.fuel_type,
        transmission: car.transmission,
        kilometersDriven: car.kilometers_driven,
        color: car.color,
        acceptOffers: car.accept_offers,
        offerPercentage: car.offer_percentage,
        insuranceValidTill: car.insurance_valid_till,
        insuranceType: car.insurance_type,
        insuranceValid: car.insurance_valid,
        lastServiceDate: car.last_service_date,
        serviceCenterType: car.service_center_type,
        serviceHistory: car.service_history,
        authorizedServiceCenter: car.authorized_service_center,
        rtoTransferSupport: car.rto_transfer_support,
        noAccidentHistory: car.no_accident_history,
        isRentAvailable: car.is_rent_available,
        dailyRate: car.daily_rate ? Number(car.daily_rate) : undefined,
        weeklyRate: car.weekly_rate ? Number(car.weekly_rate) : undefined,
        securityDeposit: car.security_deposit ? Number(car.security_deposit) : undefined,
        area: car.area,
        landmark: car.landmark,
        description: car.description,
      }));

      // Transform accessories data
      const transformedAccessories: AccessoryListing[] = (accessoriesData || []).map(accessory => ({
        id: accessory.id,
        name: accessory.name,
        brand: accessory.brand,
        category: accessory.category,
        price_min: Number(accessory.price_min),
        price_max: Number(accessory.price_max || accessory.price_min),
        location: accessory.location,
        views: accessory.views || 0,
        status: accessory.status || 'active',
        created_at: accessory.created_at,
        type: 'accessory' as const,
        price: { 
          min: Number(accessory.price_min), 
          max: Number(accessory.price_max || accessory.price_min) 
        },
        postedDate: formatDate(accessory.created_at),
      }));

      setCarListings(transformedCars);
      setAccessoryListings(transformedAccessories);

      // Set stats
      if (statsData && statsData.length > 0) {
        const userStats = statsData[0];
        setStats({
          totalCars: userStats.total_cars || 0,
          activeCars: userStats.active_cars || 0,
          totalAccessories: userStats.total_accessories || 0,
          activeAccessories: userStats.active_accessories || 0,
          totalViews: Number(userStats.total_views) || 0,
        });
      }

    } catch (err) {
      console.error('Error in fetchUserListings:', err);
      setError('Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, [user?.phone]);

  return {
    carListings,
    accessoryListings,
    stats,
    isLoading,
    error,
    refetch: fetchUserListings
  };
};
