
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileHandlers } from '@/hooks/useProfileHandlers';
import { useUserListings } from '@/hooks/useUserListings';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';
import { useState } from 'react';
import SignInModal from '@/components/modals/SignInModal';

const Profile = () => {
  const { user, isSignedIn, isLoading } = useUser();
  const isMobile = useIsMobile();
  
  // STATE FOR SIGN IN MODAL
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  
  // DEBUG LOGS
  console.log('Profile Page Debug:');
  console.log('- user:', user);
  console.log('- isSignedIn:', isSignedIn);
  console.log('- isLoading:', isLoading);
  console.log('- typeof user:', typeof user);
  console.log('- user === null:', user === null);
  console.log('- user === undefined:', user === undefined);
  
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
    isLoading: listingsLoading, 
    error,
    refetch 
  } = useUserListings();

  console.log('Profile: useUserListings hook results:', {
    carListingsCount: carListings?.length || 0,
    accessoryListingsCount: accessoryListings?.length || 0,
    stats,
    isLoading: listingsLoading,
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

  const handleSignInClick = () => {
    console.log('Sign in button clicked');
    setIsSignInModalOpen(true);
  };

  // If still loading, show loading state
  if (isLoading) {
    console.log('Profile: Still loading auth state');
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">Loading profile...</div>
          <p className="text-sm text-gray-500">Checking authentication status</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for non-signed-in users OR if user data is missing
  if (!isSignedIn || !userWithDealer) {
    console.log('Profile: Showing sign-in prompt', { isSignedIn, hasUser: !!userWithDealer });
    return (
      <>
        <SignInPrompt onSignIn={handleSignInClick} />
        <SignInModal 
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
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
    isLoading: listingsLoading,
    error
  });

  return (
    <>
      <ProfileContent
        user={userWithDealer}
        listings={carListings}
        accessories={accessoryListings}
        stats={realStats}
        isLoading={listingsLoading}
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
