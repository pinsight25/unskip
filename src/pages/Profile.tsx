
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileHandlers } from '@/hooks/useProfileHandlers';
import { useUserListings } from '@/hooks/useUserListings';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';

const Profile = () => {
  const { user, isSignedIn } = useUser();
  const isMobile = useIsMobile();
  
  console.log('Profile page render:', { user, isSignedIn, isMobile });
  
  const {
    isEditProfileOpen,
    setIsEditProfileOpen,
    isSignOutModalOpen,
    setIsSignOutModalOpen,
    deleteModal,
    setDeleteModal
  } = useProfileState();

  const {
    handleEditProfile,
    handleSignOut,
    handleDeleteListing,
    confirmDeleteListing
  } = useProfileHandlers();

  // Fetch real user listings and stats
  const { 
    carListings, 
    accessoryListings, 
    stats, 
    isLoading, 
    error,
    refetch 
  } = useUserListings();

  console.log('Profile: useUserListings hook results:', {
    carListingsCount: carListings?.length || 0,
    accessoryListingsCount: accessoryListings?.length || 0,
    stats,
    isLoading,
    error
  });

  // Add mock dealer verification to user - in real app this would come from context
  const userWithDealer = user ? {
    ...user,
    dealerVerified: true // Mock dealer verification status
  } : null;

  const handleDeleteListingWrapper = (listingId: string, title: string) => {
    handleDeleteListing(listingId, title, setDeleteModal);
  };

  const confirmDeleteListingWrapper = () => {
    confirmDeleteListing(setDeleteModal);
    // Refetch data after deletion
    setTimeout(() => {
      refetch();
    }, 1500);
  };

  // Show sign-in prompt for non-signed-in users
  if (!isSignedIn || !userWithDealer) {
    console.log('Profile: Showing sign-in prompt');
    return (
      <>
        <SignInPrompt onSignIn={() => {}} />
        <ProfileModals
          isEditProfileOpen={isEditProfileOpen}
          setIsEditProfileOpen={setIsEditProfileOpen}
          isSignOutModalOpen={isSignOutModalOpen}
          setIsSignOutModalOpen={setIsSignOutModalOpen}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          user={userWithDealer}
          onEditProfile={handleEditProfile}
          onSignOut={handleSignOut}
          onConfirmDeleteListing={confirmDeleteListingWrapper}
          isMobile={isMobile}
        />
      </>
    );
  }

  // Calculate real stats
  const realStats = {
    totalViews: stats.totalViews,
    activeListings: stats.activeCars + stats.activeAccessories,
    totalOffers: 0 // We'll implement this later when we add offers functionality
  };

  console.log('Profile: Showing profile content with real data:', { 
    carListings: carListings.length, 
    accessoryListings: accessoryListings.length,
    stats: realStats,
    isLoading,
    error
  });

  return (
    <>
      <ProfileContent
        user={userWithDealer}
        listings={carListings}
        accessories={accessoryListings}
        stats={realStats}
        isLoading={isLoading}
        error={error}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onSignOut={() => setIsSignOutModalOpen(true)}
        onDeleteListing={handleDeleteListingWrapper}
      />
      
      <ProfileModals
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        isSignOutModalOpen={isSignOutModalOpen}
        setIsSignOutModalOpen={setIsSignOutModalOpen}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        user={userWithDealer}
        onEditProfile={handleEditProfile}
        onSignOut={handleSignOut}
        onConfirmDeleteListing={confirmDeleteListingWrapper}
        isMobile={isMobile}
      />
    </>
  );
};

export default Profile;
