
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

export const getCarLimit = (userType: UserType = 'regular') => {
  return FREE_LIMITS.cars[userType];
};

export const getAccessoryLimit = (userType: UserType = 'regular') => {
  return FREE_LIMITS.accessories[userType];
};

// Helper functions for limit checking
export const canPostMoreCars = (currentCount: number, userType: UserType = 'regular') => {
  const limit = getCarLimit(userType);
  return currentCount < limit;
};

export const getRemainingCarSlots = (currentCount: number, userType: UserType = 'regular') => {
  const limit = getCarLimit(userType);
  return Math.max(0, limit - currentCount);
};

export const shouldShowUpgradePrompt = (currentCount: number, userType: UserType = 'regular') => {
  if (userType === 'dealer') return false;
  const limit = getCarLimit('regular');
  return currentCount >= limit - 1; // Show when 1 slot remaining or at limit
};

export const getUpgradeMessage = (currentCount: number, userType: UserType = 'regular') => {
  if (userType === 'dealer') return null;
  
  const limit = getCarLimit('regular');
  if (currentCount >= limit) {
    return {
      type: 'error' as const,
      message: 'Limit reached! You cannot post more cars.',
      suggestion: 'Upgrade to dealer account to list up to 10 cars.'
    };
  } else if (currentCount === limit - 1) {
    return {
      type: 'warning' as const,
      message: `Near limit: You have 1 car listing remaining.`,
      suggestion: 'Upgrade to dealer account to list up to 10 cars!'
    };
  }
  return null;
};
