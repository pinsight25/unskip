
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import CarDetailContainer from '@/components/car/CarDetailContainer';
import { supabase } from '@/lib/supabase';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { useQueryClient } from '@tanstack/react-query';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const queryClient = useQueryClient();



  useEffect(() => {
    let mounted = true;
    
    // Clear any cached data for this car to ensure fresh fetch
    if (id) {
      queryClient.removeQueries({ queryKey: ['car', id] });
    }
    
    // Reset state when component mounts or ID changes
    setCar(null);
    setSellerInfo(null);
    setError(false);
    setLoading(true);
    
    const fetchCar = async () => {
      if (!id) return;
      try {
        if (!mounted) return; // Check if still mounted before proceeding
        
        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        // Simple query - just get the car
        const carQueryPromise = supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
        
        const { data: carData, error: carError } = await Promise.race([
          carQueryPromise,
          timeoutPromise
        ]) as any;
        if (carError) {
          throw carError;
        }
        if (!carData) {
          throw new Error('Car not found');
        }
        // Map carData and images to Car type
        const carObj: Car = {
          id: carData.id,
          title: `${carData.year} ${carData.make} ${carData.model}`,
          brand: carData.make,
          model: carData.model,
          variant: carData.variant,
          year: carData.year,
          price: carData.price,
          images: [], // will be set below
          mileage: carData.kilometers_driven || 0,
          kilometersDriven: carData.kilometers_driven || 0,
          fuelType: carData.fuel_type,
          transmission: carData.transmission,
          ownership: carData.number_of_owners || 1,
          ownershipNumber: carData.number_of_owners || 1,
          location: [carData.area, carData.city].filter(Boolean).join(', '),
          description: carData.description || '',
          seller: {
            id: carData.seller_id || '',
            name: '',
            type: 'individual',
            phone: '',
            email: '',
            verified: carData.verified || false,
            rating: 0,
            totalSales: 0,
            memberSince: '',
            avatar: '',
            businessName: '',
            location: [carData.area, carData.city].filter(Boolean).join(', '),
          },
          color: carData.color,
          landmark: carData.landmark,
          seatingCapacity: carData.seating_capacity,
          isRentAvailable: carData.is_rent_available || false,
          rentPrice: carData.daily_rate ? { daily: carData.daily_rate, weekly: carData.weekly_rate || 0 } : undefined,
          rentPolicies: undefined,
          verified: carData.verified === true,
          featured: carData.featured === true,
          views: carData.views || 0,
          createdAt: carData.created_at,
          registrationYear: carData.registration_year,
          registrationState: carData.registration_state,
          fitnessCertificateValidTill: carData.fitness_certificate_valid_till,
          noAccidentHistory: carData.no_accident_history,
          acceptOffers: carData.accept_offers,
          offerPercentage: carData.offer_percentage,
          insuranceValid: carData.insurance_valid,
          insuranceValidTill: carData.insurance_valid_till,
          insuranceType: carData.insurance_type,
          lastServiceDate: carData.last_service_date,
          serviceCenterType: carData.service_center_type,
          serviceAtAuthorized: carData.authorized_service_center,
          rtoTransferSupport: carData.rto_transfer_support,
          insurance: undefined,
          serviceHistory: undefined,
          seller_type: 'individual',
        };
        if (!mounted) return;
        setCar(carObj); // Set car immediately
        
        // Fetch images separately
        const { data: images } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', id);
        const imageUrls = images?.map((img: any) => img.image_url) || [];
        if (mounted) {
          setCar(prev => prev ? { ...prev, images: imageUrls } : prev);
        }
        // Fetch seller info
        if (carData.seller_id) {
          const { data: seller } = await supabase
            .from('users')
            .select('id, name, created_at, is_verified, phone, email, user_type')
            .eq('id', carData.seller_id)
            .single();
          
          if (seller && mounted) {
            setSellerInfo(seller);
            
            // Check if seller is a dealer
            let dealerInfo = null;
            if (seller.user_type === 'dealer') {
              const { data: dealer } = await supabase
                .from('dealers')
                .select('business_name, verification_status')
                .eq('user_id', carData.seller_id)
                .single();
              dealerInfo = dealer;
            }
            
            if (mounted) {
              setCar(prev => prev ? {
                ...prev,
                seller: {
                  ...prev.seller,
                  name: seller.user_type === 'dealer' ? (dealerInfo?.business_name || seller.name || 'Dealer') : (seller.name || 'Individual Seller'),
                  type: seller.user_type || 'individual',
                  verified: seller.is_verified || false,
                  dealerVerified: seller.user_type === 'dealer' ? (dealerInfo?.verification_status === 'verified') : undefined,
                  memberSince: seller.created_at ? new Date(seller.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '',
                  phone: seller.phone || '',
                  email: seller.email || '',
                },
                seller_type: seller.user_type || 'individual',
              } : prev);
            }
          }
        }
      } catch (error) {
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchCar();
    // Real-time subscriptions for cars and car_images
    if (id) {
      const channel = supabase.channel(`realtime-car-detail-${id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cars',
            filter: `id=eq.${id}`
          },
          () => { fetchCar(); }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'car_images',
            filter: `car_id=eq.${id}`
          },
          () => { fetchCar(); }
        )
        .subscribe();
      return () => { supabase.removeChannel(channel); mounted = false; };
    }
    return () => { mounted = false; };
  }, [id]);

  useRealtimeRefetch('cars', ['car', id]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 responsive-header-spacing">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading car details...</h2>
            <p className="text-gray-600">Please wait while we fetch the car information.</p>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-primary hover:underline"
              >
                Click here if loading takes too long
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state only after loading is complete and there's an actual error
  if (error || (!loading && !car)) {
    return (
      <div className="min-h-screen bg-gray-50 responsive-header-spacing">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
            <p className="text-gray-600 mb-4">Sorry, the car you are looking for could not be found or there was an error loading it.</p>
            <div className="space-y-2">
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Go back to homepage
              </Link>
              <div className="mt-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Try refreshing the page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 responsive-header-spacing">
      <div className="w-full">
        <CarDetailContainer car={car} />
        {/* <BadgeDebugger car={car} /> */}
      </div>
    </div>
  );
};

export default CarDetail;
