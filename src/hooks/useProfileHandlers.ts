
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { carService } from '@/services/carService';
import { supabase } from '@/lib/supabase';
import { debugAuthState } from '@/utils/debugAuth';

export const useProfileHandlers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, setUser } = useUser();

  const handleEditProfile = async (newProfile: any) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: newProfile.name,
          email: newProfile.email,
          city: newProfile.city
        })
        .eq('id', user.id)
        .select()
        .single();
      if (error) {
        toast({
          title: 'Profile Update Failed',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      // Refresh user context
      if (setUser) {
        setUser({ ...user, ...data });
      } else {
        window.location.reload();
      }
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.'
      });
    } catch (err: any) {
      toast({
        title: 'Profile Update Failed',
        description: err.message || 'An error occurred.',
        variant: 'destructive'
      });
    }
  };

           const handleSignOut = async () => {
           // Prevent multiple simultaneous calls
           if ((window as any).__handleSignOutInProgress) {
             return;
           }
    
    (window as any).__handleSignOutInProgress = true;
    
    try {
                   // Check if user is actually signed in before attempting sign out
             if (!user) {
               return;
             }

                   // Debug auth state before sign out
             const authState = debugAuthState();
             if (!authState.isActuallySignedIn) {
               return;
             }

                   // Call signOut with timeout
      const signOutPromise = signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 10000)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      
      // Add a small delay to ensure state has updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
                   // Verify user is actually signed out before showing toast
             const postSignOutState = debugAuthState();
             if (postSignOutState.isActuallySignedIn) {
               toast({
                 title: "Sign Out Failed",
                 description: "There was a problem signing you out. Please try again.",
                 variant: "destructive"
               });
               return;
             }
      
      // Only show toast after successful sign out
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully",
      });
      navigate('/');
               } catch (error) {
             // If sign out fails, don't show success toast
      toast({
        title: "Sign Out Failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Always clear the flag
      (window as any).__handleSignOutInProgress = false;
    }
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
      // Set carDeleted and carsListUpdated flags
      localStorage.setItem('carDeleted', JSON.stringify({
        timestamp: Date.now(),
        carId: listingId,
      }));
      localStorage.setItem('carsListUpdated', JSON.stringify({
        timestamp: Date.now(),
        action: 'delete',
        carId: listingId,
      }));
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
