
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

export const useProfileHandlers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useUser();

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

  const handleDeleteListing = (
    listingId: string, 
    title: string,
    setDeleteModal: (modal: { isOpen: boolean; listingId: string | null; title: string }) => void
  ) => {
    setDeleteModal({
      isOpen: true,
      listingId,
      title
    });
  };

  const confirmDeleteListing = (
    setDeleteModal: (modal: { isOpen: boolean; listingId: string | null; title: string }) => void
  ) => {
    setTimeout(() => {
      setDeleteModal({ isOpen: false, listingId: null, title: '' });
      toast({
        title: "Listing Deleted",
        description: "Your listing has been deleted successfully",
      });
    }, 1000);
  };

  return {
    handleEditProfile,
    handleSignOut,
    handleDeleteListing,
    confirmDeleteListing
  };
};
