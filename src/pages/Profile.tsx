
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isSignedIn, signOut } = useUser();
  const isMobile = useIsMobile();
  
  console.log('Profile page render:', { user, isSignedIn, isMobile });
  
  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    listingId: string | null;
    title: string;
  }>({
    isOpen: false,
    listingId: null,
    title: ''
  });

  // Mock data with enhanced listing information for duplication
  const [listings] = useState([
    {
      id: '1',
      title: '2022 Maruti Swift VXI',
      price: 650000,
      location: 'Mumbai, Maharashtra',
      views: 45,
      postedDate: '2 days ago',
      status: 'active',
      // Enhanced data for duplication
      make: 'Maruti',
      model: 'Swift',
      variant: 'VXI',
      year: 2022,
      registrationYear: 2022,
      registrationState: 'MH',
      fitnessCertificateValidTill: '2025-07-15',
      numberOfOwners: '1',
      seatingCapacity: '5',
      fuelType: 'Petrol',
      transmission: 'Manual',
      kilometersDriven: 15000,
      color: 'Red',
      acceptOffers: true,
      offerPercentage: 70,
      insuranceValidTill: '2024-12-15',
      insuranceType: 'Comprehensive',
      insuranceValid: true,
      lastServiceDate: '2024-01-15',
      serviceCenterType: 'Authorized',
      serviceHistory: true,
      authorizedServiceCenter: true,
      rtoTransferSupport: true,
      noAccidentHistory: true,
      isRentAvailable: false,
      city: 'Mumbai',
      area: 'Andheri West',
      landmark: 'Near Metro Station',
      description: 'Well maintained car with full service history.'
    },
    {
      id: '2',
      title: '2021 Hyundai i20 Sportz',
      price: 750000,
      location: 'Mumbai, Maharashtra',
      views: 32,
      postedDate: '5 days ago',
      status: 'active',
      // Enhanced data for duplication
      make: 'Hyundai',
      model: 'i20',
      variant: 'Sportz',
      year: 2021,
      registrationYear: 2021,
      registrationState: 'MH',
      fitnessCertificateValidTill: '2026-03-20',
      numberOfOwners: '1',
      seatingCapacity: '5',
      fuelType: 'Petrol',
      transmission: 'Manual',
      kilometersDriven: 25000,
      color: 'Blue',
      acceptOffers: true,
      offerPercentage: 75,
      insuranceValidTill: '2024-11-20',
      insuranceType: 'Comprehensive',
      insuranceValid: true,
      lastServiceDate: '2024-02-10',
      serviceCenterType: 'Authorized',
      serviceHistory: true,
      authorizedServiceCenter: true,
      rtoTransferSupport: true,
      noAccidentHistory: true,
      isRentAvailable: false,
      city: 'Mumbai',
      area: 'Bandra East',
      landmark: 'Near Shopping Mall',
      description: 'Excellent condition with complete paperwork.'
    },
    {
      id: '3',
      title: '2020 Honda City VX',
      price: 950000,
      location: 'Mumbai, Maharashtra',
      views: 28,
      postedDate: '1 week ago',
      status: 'sold',
      // Enhanced data for duplication
      make: 'Honda',
      model: 'City',
      variant: 'VX',
      year: 2020,
      registrationYear: 2020,
      registrationState: 'MH',
      fitnessCertificateValidTill: '2025-05-10',
      numberOfOwners: '1',
      seatingCapacity: '5',
      fuelType: 'Petrol',
      transmission: 'CVT',
      kilometersDriven: 35000,
      color: 'White',
      acceptOffers: false,
      offerPercentage: 0,
      insuranceValidTill: '2024-10-10',
      insuranceType: 'Comprehensive',
      insuranceValid: true,
      lastServiceDate: '2024-03-05',
      serviceCenterType: 'Authorized',
      serviceHistory: true,
      authorizedServiceCenter: true,
      rtoTransferSupport: true,
      noAccidentHistory: true,
      isRentAvailable: false,
      city: 'Mumbai',
      area: 'Powai',
      landmark: 'Near Tech Park',
      description: 'Premium sedan in pristine condition.'
    }
  ]);

  const stats = {
    totalViews: listings.reduce((sum, listing) => sum + listing.views, 0),
    activeListings: listings.filter(l => l.status === 'active').length,
    totalOffers: 4 // Mock number of received offers
  };

  const handleEditProfile = (newProfile: any) => {
    // In real app, this would update user context
    console.log('Profile updated:', newProfile);
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
    navigate('/');
  };

  const handleDeleteListing = (listingId: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      listingId,
      title
    });
  };

  const confirmDeleteListing = () => {
    setTimeout(() => {
      setDeleteModal({ isOpen: false, listingId: null, title: '' });
      toast({
        title: "Listing Deleted",
        description: "Your listing has been deleted successfully",
      });
    }, 1000);
  };

  // Show sign-in prompt for non-signed-in users
  if (!isSignedIn || !user) {
    console.log('Showing sign-in prompt');
    return (
      <>
        <SignInPrompt onSignIn={() => setIsSignInModalOpen(true)} />
        <ProfileModals
          isEditProfileOpen={isEditProfileOpen}
          setIsEditProfileOpen={setIsEditProfileOpen}
          isSignOutModalOpen={isSignOutModalOpen}
          setIsSignOutModalOpen={setIsSignOutModalOpen}
          isSignInModalOpen={isSignInModalOpen}
          setIsSignInModalOpen={setIsSignInModalOpen}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          user={user}
          onEditProfile={handleEditProfile}
          onSignOut={handleSignOut}
          onConfirmDeleteListing={confirmDeleteListing}
          isMobile={isMobile}
        />
      </>
    );
  }

  console.log('Showing profile content');
  return (
    <>
      <ProfileContent
        user={user}
        listings={listings}
        stats={stats}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onSignOut={() => setIsSignOutModalOpen(true)}
        onDeleteListing={handleDeleteListing}
      />
      
      <ProfileModals
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        isSignOutModalOpen={isSignOutModalOpen}
        setIsSignOutModalOpen={setIsSignOutModalOpen}
        isSignInModalOpen={isSignInModalOpen}
        setIsSignInModalOpen={setIsSignInModalOpen}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        user={user}
        onEditProfile={handleEditProfile}
        onSignOut={handleSignOut}
        onConfirmDeleteListing={confirmDeleteListing}
        isMobile={isMobile}
      />
    </>
  );
};

export default Profile;
