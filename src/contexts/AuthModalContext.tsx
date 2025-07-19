import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SignInModal } from '@/components/modals/SignInModal';

interface AuthModalContextType {
  isSignInModalOpen: boolean;
  openSignInModal: (onSuccess?: () => void) => void;
  closeSignInModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  const openSignInModal = (onSuccess?: () => void) => {
    setOnSuccessCallback(() => onSuccess);
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
    setOnSuccessCallback(null);
  };

  const onSuccess = useCallback((callback?: () => void) => {
    closeSignInModal();
    if (callback && typeof callback === 'function') {
      callback();
    }
  }, [closeSignInModal]);

  return (
    <AuthModalContext.Provider value={{ isSignInModalOpen, openSignInModal, closeSignInModal }}>
      {children}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeSignInModal}
        onSuccess={onSuccess}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider');
  return context;
}; 