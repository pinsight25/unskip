
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileHandlers } from '@/hooks/useProfileHandlers';
import { useUserListings } from '@/hooks/useUserListings';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useState, useEffect } from 'react';
import SignInModal from '@/components/modals/SignInModal';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { user, isLoading: authLoading } = useUser();
  const isSignedIn = !!user;
  const isMobile = useIsMobile();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const location = useLocation();

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

  const {
    carListings,
    accessoryListings,
    stats,
    isLoading: listingsLoading,
    isRefetching,
    error,
    refetch
  } = useUserListings();

  // Force refetch when navigating back to listings tab
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('tab') === 'listings') {
      refetch();
    }
  }, [location.search, refetch]);

  const userWithDealer = user ? {
    ...user,
    dealerVerified: true
  } : null;

  const handleDeleteListingWrapper = (listingId: string, title: string) => {
    handleDeleteListing(listingId, title, setDeleteModal);
  };

  const confirmDeleteListingWrapper = () => {
    confirmDeleteListing(setDeleteModal, deleteModal.listingId);
    setTimeout(() => {
      refetch();
    }, 1500);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  // Show loading only while auth is actually loading
  if (authLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  // Once auth loading is done, check sign in status
  if (!isSignedIn) {
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

  // If signed in but no user data (edge case)
  if (!user) {
    return <LoadingScreen message="Setting up profile..." />;
  }

  const realStats = {
    totalViews: stats.totalViews,
    activeListings: stats.activeCars + stats.activeAccessories,
    totalOffers: 0
  };

  return (
    <>
      <ProfileContent
        user={userWithDealer}
        listings={carListings}
        accessories={accessoryListings}
        stats={realStats}
        isLoading={listingsLoading}
        isRefetching={isRefetching}
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
