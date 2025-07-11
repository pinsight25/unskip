
import EditProfileModal from '@/components/modals/EditProfileModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import SignInModal from '@/components/modals/SignInModal';
import MobileOTPModal from '@/components/modals/MobileOTPModal';

interface ProfileModalsProps {
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isSignOutModalOpen: boolean;
  setIsSignOutModalOpen: (open: boolean) => void;
  isSignInModalOpen: boolean;
  setIsSignInModalOpen: (open: boolean) => void;
  deleteModal: {
    isOpen: boolean;
    listingId: string | null;
    title: string;
  };
  setDeleteModal: (modal: { isOpen: boolean; listingId: string | null; title: string }) => void;
  user: any;
  onEditProfile: (newProfile: any) => void;
  onSignOut: () => void;
  onConfirmDeleteListing: () => void;
  isMobile: boolean;
}

const ProfileModals = ({
  isEditProfileOpen,
  setIsEditProfileOpen,
  isSignOutModalOpen,
  setIsSignOutModalOpen,
  isSignInModalOpen,
  setIsSignInModalOpen,
  deleteModal,
  setDeleteModal,
  user,
  onEditProfile,
  onSignOut,
  onConfirmDeleteListing,
  isMobile
}: ProfileModalsProps) => {
  return (
    <>
      {/* Only render EditProfileModal if user exists */}
      {user && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentProfile={user}
          onSave={onEditProfile}
        />
      )}

      <DeleteConfirmModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={onSignOut}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listingId: null, title: '' })}
        onConfirm={onConfirmDeleteListing}
        title="Delete Listing"
        description={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
      />

      {isMobile ? (
        <MobileOTPModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
          onSuccess={() => setIsSignInModalOpen(false)}
          phoneNumber=""
          purpose="access your profile"
        />
      ) : (
        <SignInModal 
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileModals;
