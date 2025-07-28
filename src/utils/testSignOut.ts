// Test utility for sign-out functionality

export const testSignOut = async () => {
  console.log('🧪 Test Sign Out: Starting test');
  
  // Check current auth state
  const authToken = localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token');
  console.log('🧪 Test Sign Out: Current auth token exists:', !!authToken);
  
  if (authToken) {
    try {
      const tokenData = JSON.parse(authToken);
      console.log('🧪 Test Sign Out: Token data:', {
        expires_at: tokenData.expires_at,
        current_time: Date.now() / 1000,
        is_expired: tokenData.expires_at < Date.now() / 1000
      });
    } catch (error) {
      console.error('🧪 Test Sign Out: Error parsing token:', error);
    }
  }
  
  // Try to manually clear the token
  console.log('🧪 Test Sign Out: Manually clearing auth token');
  localStorage.removeItem('sb-qrzueqtkvjamvuljgaix-auth-token');
  sessionStorage.clear();
  
  // Check if token was cleared
  const newAuthToken = localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token');
  console.log('🧪 Test Sign Out: Auth token after manual clear:', !!newAuthToken);
  
  // Force page reload to test if user is actually signed out
  console.log('🧪 Test Sign Out: Reloading page to test sign out');
  window.location.reload();
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testSignOut = testSignOut;
} 