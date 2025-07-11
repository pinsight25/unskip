
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileHandlers } from '@/hooks/useProfileHandlers';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';
import { mockListings } from '@/data/profileMockData';

const Profile = () => {
  const { user, isSignedIn } = useUser();
  const isMobile = useIsMobile();
  
  console.log('Profile page render:', { user, isSignedIn, isMobile });
  
  const {
    isEditProfileOpen,
    setIsEditProfileOpen,
    isSignOutModalOpen,
    setIsSignOutModalOpen,
    isSignInModalOpen,
    setIsSignInModalOpen,
    deleteModal,
    setDeleteModal
  } = useProfileState();

  const {
    handleEditProfile,
    handleSignOut,
    handleDeleteListing,
    confirmDeleteListing
  } = useProfileHandlers();

  // Add mock dealer verification to user - in real app this would come from context
  const userWithDealer = user ? {
    ...user,
    dealerVerified: true // Mock dealer verification status
  } : null;

  const stats = {
    totalViews: mockListings.reduce((sum, listing) => sum + listing.views, 0),
    activeListings: mockListings.filter(l => l.status === 'active').length,
    totalOffers: 4 // Mock number of received offers
  };

  const handleDeleteListingWrapper = (listingId: string, title: string) => {
    handleDeleteListing(listingId, title, setDeleteModal);
  };

  const confirmDeleteListingWrapper = () => {
    confirmDeleteListing(setDeleteModal);
  };

  // Show sign-in prompt for non-signed-in users
  if (!isSignedIn || !userWithDealer) {
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
          user={userWithDealer}
          onEditProfile={handleEditProfile}
          onSignOut={handleSignOut}
          onConfirmDeleteListing={confirmDeleteListingWrapper}
          isMobile={isMobile}
        />
      </>
    );
  }

  console.log('Showing profile content');
  return (
    <>
      <ProfileContent
        user={userWithDealer}
        listings={mockListings}
        stats={stats}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onSignOut={() => setIsSignOutModalOpen(true)}
        onDeleteListing={handleDeleteListingWrapper}
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
