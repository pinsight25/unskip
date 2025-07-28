// Debug utility for authentication state tracking

export const debugAuthState = () => {
  // Check localStorage for auth token
  const authToken = localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token');
  
  // Check sessionStorage
  const sessionKeys = Object.keys(sessionStorage);
  
  // Check if user is actually signed in
  const isActuallySignedIn = !!authToken;
  
  console.log('🔍 Debug Auth State:', {
    hasAuthToken: !!authToken,
    authTokenLength: authToken?.length || 0,
    sessionStorageKeys: sessionKeys,
    isActuallySignedIn,
    timestamp: new Date().toISOString()
  });
  
  return {
    hasAuthToken: !!authToken,
    isActuallySignedIn,
    sessionKeys
  };
};

// Hook to track when "Signed Out" toast appears
export const trackSignOutToast = () => {
  const originalToast = (window as any).__originalToast;
  
  if (!originalToast) {
    // Store original toast function
    (window as any).__originalToast = (window as any).toast;
    
    // Override toast function to track "Signed Out" messages
    (window as any).toast = function(...args: any[]) {
      const [options] = args;
      if (options?.title === 'Signed Out') {
        console.log('🔍 "Signed Out" toast triggered at:', new Date().toISOString());
        console.log('🔍 Stack trace:', new Error().stack);
        debugAuthState();
      }
      return originalToast.apply(this, args);
    };
  }
};

// Function to check if user should be signed in
export const shouldUserBeSignedIn = () => {
  const authToken = localStorage.getItem('sb-qrzueqtkvjamvuljgaix-auth-token');
  if (!authToken) return false;
  
  try {
    const tokenData = JSON.parse(authToken);
    const currentTime = Date.now() / 1000;
    const tokenExpiry = tokenData.expires_at;
    
    return tokenExpiry > currentTime;
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return false;
  }
}; 