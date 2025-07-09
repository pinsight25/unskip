export const getOwnershipText = (ownership: number): string => {
  if (ownership === 1) return '1st Owner';
  if (ownership === 2) return '2nd Owner';
  if (ownership === 3) return '3rd Owner';
  return `${ownership}th Owner`;
};

export const formatKilometersDriven = (kilometers: number): string => {
  if (kilometers >= 100000) {
    return `${(kilometers/100000).toFixed(1)}L km driven`;
  } else if (kilometers >= 1000) {
    return `${(kilometers/1000).toFixed(0)}k km driven`;
  }
  return `${kilometers} km driven`;
};

// Keep backward compatibility
export const formatMileage = formatKilometersDriven;
