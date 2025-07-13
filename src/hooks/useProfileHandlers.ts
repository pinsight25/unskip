
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { carService } from '@/services/carService';

export const useProfileHandlers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user } = useUser();

  const handleEditProfile = (newProfile: any) => {
    // In real app, this would update user context
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

  const confirmDeleteListing = async (
    setDeleteModal: (modal: { isOpen: boolean; listingId: string | null; title: string }) => void,
    listingId: string | null
  ) => {
    if (!listingId || !user) return;
    const result = await carService.deleteCarListing(listingId, user.id);
    setDeleteModal({ isOpen: false, listingId: null, title: '' });
    if (result.success) {
      toast({
        title: "Listing Deleted",
        description: "Your listing has been deleted successfully",
      });
    } else {
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting your listing.",
        variant: "destructive"
      });
    }
  };

  return {
    handleEditProfile,
    handleSignOut,
    handleDeleteListing,
    confirmDeleteListing
  };
};
