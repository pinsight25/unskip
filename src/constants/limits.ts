
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
