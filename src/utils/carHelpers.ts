
export const getOwnershipText = (ownership: number): string => {
  if (ownership === 1) return '1st Owner';
  if (ownership === 2) return '2nd Owner';
  if (ownership === 3) return '3rd Owner';
  return `${ownership}th Owner`;
};

export const formatMileage = (mileage: number): string => {
  return `${(mileage/1000).toFixed(0)}k km`;
};
