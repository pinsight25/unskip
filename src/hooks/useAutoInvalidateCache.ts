import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';

export const useAutoInvalidateCache = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const lastUserId = useRef<string | undefined>(undefined);
  const lastUserType = useRef<string | undefined>(undefined);
  const invalidationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear any pending invalidation
    if (invalidationTimeoutRef.current) {
      clearTimeout(invalidationTimeoutRef.current);
    }

    // Only invalidate cache when user ID actually changes (login/logout)
    if (user?.id !== lastUserId.current) {
      lastUserId.current = user?.id;
      
      if (user) {
        // Use a longer delay to ensure user data is fully loaded and prevent race conditions
        invalidationTimeoutRef.current = setTimeout(() => {
          // Selective invalidation instead of clearing all cache
          const queriesToInvalidate = [
            ['userListings'],
            ['offers'],
            ['chats'],
            ['accessories'],
            ['dealer-info']
          ];

          // Invalidate queries one by one to prevent overwhelming the system
          queriesToInvalidate.forEach((queryKey, index) => {
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey });
            }, index * 100); // Stagger invalidations by 100ms
          });
        }, 500); // Increased delay to 500ms
      } else {
        // User logged out - clear cache more aggressively but with a delay
        invalidationTimeoutRef.current = setTimeout(() => {
          queryClient.clear();
        }, 200);
      }
    }

    return () => {
      if (invalidationTimeoutRef.current) {
        clearTimeout(invalidationTimeoutRef.current);
      }
    };
  }, [user?.id, queryClient]);

  // Invalidate cache when user type changes (individual -> dealer)
  useEffect(() => {
    if (user?.userType !== lastUserType.current) {
      lastUserType.current = user?.userType;
      
      if (user?.userType) {
        // Use optimistic updates instead of invalidation
        queryClient.setQueryData(['userListings'], (old: any) => {
          return old || [];
        });
        
        // Only invalidate dealer-specific queries
        queryClient.invalidateQueries({ queryKey: ['dealer-info'] });
      }
    }
  }, [user?.userType, queryClient]);
}; 