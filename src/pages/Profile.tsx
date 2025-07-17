
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileHandlers } from '@/hooks/useProfileHandlers';
import { useUserListings } from '@/hooks/queries/useCarQueries';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useState, useEffect } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useLocation } from 'react-router-dom';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

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

  // Use React Query hook for user listings
  const { data: listings = [], isLoading: listingsLoading, isFetching: isRefetching, error, refetch } = useUserListings(user?.id);

  // Split listings into cars and accessories (if needed)
  const carListings = Array.isArray(listings) ? listings.filter((item: any) => !item.type || item.type === 'car') : [];
  const accessoryListings = Array.isArray(listings) ? listings.filter((item: any) => item.type === 'accessory') : [];

  // Compute stats
  const stats = {
    totalViews: carListings.reduce((sum: number, l: any) => sum + (l.views || 0), 0),
    activeListings: carListings.filter((l: any) => l.status === 'active').length + accessoryListings.filter((a: any) => a.status === 'active').length,
    totalOffers: 0 // Placeholder, update if you have offers data
  };

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

  // Remove localStorage-based refresh logic - React Query handles this automatically
  useRealtimeRefetch('offers', ['offers', user?.id]);

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

  return (
    <>
      <ProfileContent
        user={userWithDealer}
        listings={carListings}
        accessories={accessoryListings}
        stats={stats}
        isLoading={listingsLoading}
        isRefetching={isRefetching}
        error={error ? (typeof error === 'string' ? error : error.message || String(error)) : null}
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
