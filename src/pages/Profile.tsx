
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

const Profile = () => {
  const { user, isSignedIn, isLoading } = useUser();
  const isMobile = useIsMobile();
  const [forceLoad, setForceLoad] = useState(false);
  
  // STATE FOR SIGN IN MODAL
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  
  // Force load after 5 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn('🚨 FORCING PROFILE TO LOAD after 5 seconds');
      setForceLoad(true);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);
  
  // DEBUG LOGS
  console.log('Profile Page Debug:');
  console.log('- user:', user);
  console.log('- isSignedIn:', isSignedIn);
  console.log('- isLoading:', isLoading);
  console.log('- forceLoad:', forceLoad);
  
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

  // If still loading and not forced, show loading state with timeout
  if (isLoading && !forceLoad) {
    console.log('Profile: Still loading auth state');
    return (
      <LoadingScreen 
        message="Loading profile..." 
        timeout={3000}
        onTimeout={() => setForceLoad(true)}
      />
    );
  }

  // If signed in but no user data yet, show profile setup message
  if (isSignedIn && !userWithDealer && !isLoading) {
    console.log('Profile: Signed in but no user data - showing setup message');
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-md mx-auto px-4 py-12 md:py-16 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Setting up your profile...</h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Please wait while we prepare your account
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for non-signed-in users ONLY
  if (!isSignedIn) {
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
