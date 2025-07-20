
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileHandlers } from '@/hooks/useProfileHandlers';
import { useUserListings } from '@/hooks/queries/useCarQueries';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileModals from '@/components/profile/ProfileModals';
import SignInPrompt from '@/components/profile/SignInPrompt';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useLocation } from 'react-router-dom';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

// Simple skeleton that matches ProfileContent layout
const ProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <Skeleton className="h-8 w-48 mb-8" /> {/* Title */}
    <div className="flex gap-4 mb-8">
      <Skeleton className="h-10 w-32" /> {/* Tab 1 */}
      <Skeleton className="h-10 w-32" /> {/* Tab 2 */}
    </div>
    <div className="grid gap-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

const Profile = () => {
  const { user } = useUser();
  const { data: listings = [] } = useUserListings(user?.id);
  const profileState = useProfileState();
  const profileHandlers = useProfileHandlers();
  const { openSignInModal } = useAuthModal();

  const handleSignIn = () => {
    openSignInModal();
  };

  if (!user) {
    return <SignInPrompt onSignIn={handleSignIn} />;
  }

  return (
    <>
      <ProfileContent
        user={user}
        listings={listings}
        onEditProfile={() => profileState.setIsEditProfileOpen(true)}
        onSignOut={profileHandlers.handleSignOut}
      />
      <ProfileModals
        isEditProfileOpen={profileState.isEditProfileOpen}
        setIsEditProfileOpen={profileState.setIsEditProfileOpen}
        isSignOutModalOpen={profileState.isSignOutModalOpen}
        setIsSignOutModalOpen={profileState.setIsSignOutModalOpen}
        deleteModal={profileState.deleteModal}
        setDeleteModal={profileState.setDeleteModal}
        user={user}
        onEditProfile={profileHandlers.handleEditProfile}
        onSignOut={profileHandlers.handleSignOut}
        onConfirmDeleteListing={() => {}}
        isMobile={false}
      />
    </>
  );
};

export default Profile;
