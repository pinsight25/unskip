
import { CarListing, AccessoryListing } from '@/types/userListings';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

export const transformCarsData = (carsData: any[]): CarListing[] => {
  return (carsData || []).map(car => ({
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
};

export const transformAccessoriesData = (accessoriesData: any[]): AccessoryListing[] => {
  return (accessoriesData || []).map(accessory => ({
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
    images: [], // Default empty images array
  }));
};
