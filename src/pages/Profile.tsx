
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isSignedIn, signOut } = useUser();
  
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

  // Mock data
  const [listings] = useState([
    {
      id: '1',
      title: '2022 Maruti Swift VXI',
      price: 650000,
      location: 'Mumbai, Maharashtra',
      views: 45,
      postedDate: '2 days ago',
      status: 'active'
    },
    {
      id: '2',
      title: '2021 Hyundai i20 Sportz',
      price: 750000,
      location: 'Mumbai, Maharashtra',
      views: 32,
      postedDate: '5 days ago',
      status: 'active'
    },
    {
      id: '3',
      title: '2020 Honda City VX',
      price: 950000,
      location: 'Mumbai, Maharashtra',
      views: 28,
      postedDate: '1 week ago',
      status: 'sold'
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
        />
      </>
    );
  }

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
      />
    </>
  );
};

export default Profile;
