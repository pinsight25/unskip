import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';

/**
 * Automatically invalidate cache when user data changes
 * This follows industry best practices for automatic data synchronization
 */
export const useAutoInvalidateCache = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const lastUserId = useRef<string | undefined>(undefined);
  const lastUserType = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only invalidate if user ID actually changed (login/logout)
    if (user?.id !== lastUserId.current) {
      lastUserId.current = user?.id;
      
      if (user) {
        // Small delay to ensure user data is fully loaded
        const timer = setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['cars'] });
          queryClient.invalidateQueries({ queryKey: ['userListings'] });
          queryClient.invalidateQueries({ queryKey: ['dealers'] });
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [user?.id, queryClient]);

  // Invalidate cache when user type changes (individual -> dealer)
  useEffect(() => {
    if (user?.userType !== lastUserType.current) {
      lastUserType.current = user?.userType;
      
      if (user?.userType) {
        queryClient.invalidateQueries({ queryKey: ['cars'] });
      }
    }
  }, [user?.userType, queryClient]);
}; 