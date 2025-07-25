
export const FREE_LIMITS = {
  cars: { 
    regular: 5, 
    dealer: 10 
  },
  accessories: { 
    regular: 10, 
    dealer: 10 
  },
  photosPerListing: 8,
  editsPerDay: 10
} as const;

export type UserType = 'regular' | 'dealer';

export const getCarLimit = (userType: UserType = 'regular', dealerRegistrationCompleted: boolean = false) => {
  // Dealers who haven't completed registration get limited access (2 cars)
  if (userType === 'dealer' && !dealerRegistrationCompleted) {
    return 2; // Limited access instead of blocking
  }
  return FREE_LIMITS.cars[userType];
};

export const getAccessoryLimit = (userType: UserType = 'regular', dealerRegistrationCompleted: boolean = false) => {
  // Dealers who haven't completed registration get regular user limits
  if (userType === 'dealer' && !dealerRegistrationCompleted) {
    return FREE_LIMITS.accessories.regular;
  }
  return FREE_LIMITS.accessories[userType];
};

// Helper functions for limit checking
export const canPostMoreCars = (currentCount: number, userType: UserType = 'regular', dealerRegistrationCompleted: boolean = false) => {
  const limit = getCarLimit(userType, dealerRegistrationCompleted);
  return currentCount < limit;
};

export const getRemainingCarSlots = (currentCount: number, userType: UserType = 'regular', dealerRegistrationCompleted: boolean = false) => {
  const limit = getCarLimit(userType, dealerRegistrationCompleted);
  return Math.max(0, limit - currentCount);
};

export const shouldShowUpgradePrompt = (currentCount: number, userType: UserType = 'regular', dealerRegistrationCompleted: boolean = false) => {
  // Show upgrade prompt for regular users or incomplete dealers
  if (userType === 'dealer' && dealerRegistrationCompleted) return false;
  const limit = getCarLimit(userType, dealerRegistrationCompleted);
  return currentCount >= limit - 1; // Show when 1 slot remaining or at limit
};

export const getUpgradeMessage = (currentCount: number, userType: UserType = 'regular', dealerRegistrationCompleted: boolean = false) => {
  // Don't show upgrade message for complete dealers
  if (userType === 'dealer' && dealerRegistrationCompleted) return null;
  
  const limit = getCarLimit(userType, dealerRegistrationCompleted);
  if (currentCount >= limit) {
    if (userType === 'dealer' && !dealerRegistrationCompleted) {
      return {
        type: 'error' as const,
        message: 'Complete your dealer registration to unlock unlimited listings.',
        suggestion: 'Finish your dealer profile to list up to 10 cars.'
      };
    } else {
      return {
        type: 'error' as const,
        message: 'Limit reached! You cannot post more cars.',
        suggestion: 'Upgrade to dealer account to list up to 10 cars.'
      };
    }
  } else if (currentCount === limit - 1) {
    if (userType === 'dealer' && !dealerRegistrationCompleted) {
      return {
        type: 'warning' as const,
        message: `Near limit: You have 1 car listing remaining.`,
        suggestion: 'Complete dealer registration to unlock unlimited listings!'
      };
    } else {
      return {
        type: 'warning' as const,
        message: `Near limit: You have 1 car listing remaining.`,
        suggestion: 'Upgrade to dealer account to list up to 10 cars!'
      };
    }
  }
  return null;
};
