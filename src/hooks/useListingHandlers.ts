
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  views: number;
  postedDate: string;
  status: string;
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  registrationYear?: number;
  registrationState?: string;
  fitnessCertificateValidTill?: string;
  numberOfOwners?: string;
  seatingCapacity?: string;
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
  dailyRate?: string;
  weeklyRate?: string;
  securityDeposit?: string;
  city?: string;
  area?: string;
  landmark?: string;
  description?: string;
}

interface Accessory {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: { min: number; max: number };
  images: string[];
  location: string;
  views: number;
  postedDate: string;
  status: string;
  type: 'accessory';
}

export const useListingHandlers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditListing = (listing: Listing) => {
    const editData = {
      make: listing.make || '',
      model: listing.model || '',
      variant: listing.variant || '',
      year: listing.year?.toString() || '',
      registrationYear: listing.registrationYear?.toString() || '',
      registrationState: listing.registrationState || '',
      fitnessCertificateValidTill: listing.fitnessCertificateValidTill || '',
      numberOfOwners: listing.numberOfOwners || '1',
      seatingCapacity: listing.seatingCapacity || '5',
      fuelType: listing.fuelType || '',
      transmission: listing.transmission || '',
      kilometersDriven: listing.kilometersDriven?.toString() || '',
      color: listing.color || '',
      price: listing.price?.toString() || '',
      acceptOffers: listing.acceptOffers ?? true,
      offerPercentage: listing.offerPercentage?.toString() || '70',
      insuranceValidTill: listing.insuranceValidTill || '',
      insuranceType: listing.insuranceType || 'Comprehensive',
      insuranceValid: listing.insuranceValid ?? false,
      lastServiceDate: listing.lastServiceDate || '',
      serviceCenterType: listing.serviceCenterType || 'Authorized',
      serviceHistory: listing.serviceHistory ?? false,
      authorizedServiceCenter: listing.authorizedServiceCenter ?? false,
      rtoTransferSupport: listing.rtoTransferSupport ?? true,
      noAccidentHistory: listing.noAccidentHistory ?? false,
      isRentAvailable: listing.isRentAvailable ?? false,
      dailyRate: listing.dailyRate || '',
      weeklyRate: listing.weeklyRate || '',
      securityDeposit: listing.securityDeposit || '',
      city: listing.city || '',
      area: listing.area || '',
      landmark: listing.landmark || '',
      description: listing.description || '',
      sellerName: 'John Doe',
      phone: '+91 9876543210',
      email: 'john@example.com',
      address: '123 Main Street',
    };

    sessionStorage.setItem('editListingData', JSON.stringify({
      ...editData,
      listingId: listing.id
    }));
    
    navigate(`/sell?edit=${listing.id}`);
    
    toast({
      title: "Editing Listing",
      description: "Loading your listing data for editing",
    });
  };

  const handleDuplicateListing = (listing: Listing) => {
    const duplicateData = {
      make: listing.make || '',
      model: listing.model || '',
      variant: listing.variant || '',
      year: listing.year?.toString() || '',
      registrationYear: listing.registrationYear?.toString() || '',
      registrationState: listing.registrationState || '',
      fitnessCertificateValidTill: listing.fitnessCertificateValidTill || '',
      numberOfOwners: listing.numberOfOwners || '1',
      seatingCapacity: listing.seatingCapacity || '5',
      fuelType: listing.fuelType || '',
      transmission: listing.transmission || '',
      kilometersDriven: listing.kilometersDriven?.toString() || '',
      color: listing.color || '',
      price: listing.price?.toString() || '',
      acceptOffers: listing.acceptOffers ?? true,
      offerPercentage: listing.offerPercentage?.toString() || '70',
      insuranceValidTill: listing.insuranceValidTill || '',
      insuranceType: listing.insuranceType || 'Comprehensive',
      insuranceValid: listing.insuranceValid ?? false,
      lastServiceDate: listing.lastServiceDate || '',
      serviceCenterType: listing.serviceCenterType || 'Authorized',
      serviceHistory: listing.serviceHistory ?? false,
      authorizedServiceCenter: listing.authorizedServiceCenter ?? false,
      rtoTransferSupport: listing.rtoTransferSupport ?? true,
      noAccidentHistory: listing.noAccidentHistory ?? false,
      isRentAvailable: listing.isRentAvailable ?? false,
      dailyRate: listing.dailyRate || '',
      weeklyRate: listing.weeklyRate || '',
      securityDeposit: listing.securityDeposit || '',
      city: listing.city || '',
      area: listing.area || '',
      landmark: listing.landmark || '',
      description: listing.description || '',
      sellerName: '',
      phone: '',
      email: '',
      address: '',
    };

    sessionStorage.setItem('duplicateListingData', JSON.stringify(duplicateData));
    navigate('/sell?duplicate=true');
  };

  const handleEditAccessory = (accessory: Accessory) => {
    navigate(`/post-accessory?edit=${accessory.id}`);
    toast({
      title: "Editing Accessory",
      description: "Loading your accessory data for editing",
    });
  };

  return {
    handleEditListing,
    handleDuplicateListing,
    handleEditAccessory
  };
};
