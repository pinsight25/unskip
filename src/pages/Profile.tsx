
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
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { user, isLoading: authLoading } = useUser();
  const isSignedIn = !!user;
  const isMobile = useIsMobile();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInModalKey, setSignInModalKey] = useState(0);
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

  // Auto-scroll to new listing if scrollTo param is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToId = params.get('scrollTo');
    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(`listing-${scrollToId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('highlight-listing');
          setTimeout(() => el.classList.remove('highlight-listing'), 2000);
        }
      }, 500); // Wait for listings to render
    }
  }, [location.search, carListings]);

  useEffect(() => {
    const userId = user?.id;
    const flags = [
      { key: 'carPosted', session: `hasRefreshed_profile_posted_${userId}` },
      { key: 'carUpdated', session: `hasRefreshed_profile_updated_${userId}` },
      { key: 'carDeleted', session: `hasRefreshed_profile_deleted_${userId}` },
    ];

    let didRefetch = false;

    flags.forEach(({ key, session }) => {
      const flagData = localStorage.getItem(key);
      if (flagData && userId) {
        try {
          const { timestamp } = JSON.parse(flagData);
          const timeDiff = Date.now() - timestamp;
          if (timeDiff < 10000 && !sessionStorage.getItem(session)) {
            localStorage.removeItem(key);
            sessionStorage.setItem(session, 'true');
            if (typeof refetch === 'function' && !didRefetch) {
              refetch();
              didRefetch = true;
            }
          } else {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
      // Clean up session flag after 30 seconds
      setTimeout(() => {
        sessionStorage.removeItem(session);
      }, 30000);
    });
  }, [user?.id, refetch]);

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

  const handleShowSignInModal = () => {
    setSignInModalKey(prev => prev + 1);
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
        <SignInPrompt onSignIn={handleShowSignInModal} />
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
        refetch={refetch}
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
