// Global cache utilities for React Query
let queryClient: any = null;

export const setQueryClient = (client: any) => {
  queryClient = client;
};

export const clearCarsCache = () => {
  if (queryClient) {
    queryClient.removeQueries({ queryKey: ['cars'] });
    console.log('✅ Cars cache cleared');
  } else {
    console.warn('❌ QueryClient not available');
  }
};

export const invalidateCarsCache = () => {
  if (queryClient) {
    queryClient.invalidateQueries({ queryKey: ['cars'] });
    console.log('✅ Cars cache invalidated');
  } else {
    console.warn('❌ QueryClient not available');
  }
};

export const clearAllCache = () => {
  if (queryClient) {
    queryClient.clear();
    console.log('✅ All cache cleared');
  } else {
    console.warn('❌ QueryClient not available');
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).clearCarsCache = clearCarsCache;
  (window as any).invalidateCarsCache = invalidateCarsCache;
  (window as any).clearAllCache = clearAllCache;
} 