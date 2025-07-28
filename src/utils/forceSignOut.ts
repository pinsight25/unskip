// Force sign out utility - clears all auth data and reloads page

export const forceSignOut = () => {
  console.log('🧪 Force Sign Out: Starting forced sign out');
  
  // Clear all localStorage
  localStorage.clear();
  
  // Clear all sessionStorage
  sessionStorage.clear();
  
  // Clear any cached data
  if (typeof window !== 'undefined') {
    // Clear React Query cache if available
    if ((window as any).__REACT_QUERY_CACHE__) {
      (window as any).__REACT_QUERY_CACHE__.clear();
    }
    
    // Clear any other cached data
    const keysToRemove = [
      'sb-qrzueqtkvjamvuljgaix-auth-token',
      'carDeleted',
      'carsListUpdated',
      'carPosted',
      'user',
      'auth',
      'session'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
  
  console.log('🧪 Force Sign Out: All data cleared, reloading page');
  
  // Force page reload
  window.location.href = '/';
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).forceSignOut = forceSignOut;
} 