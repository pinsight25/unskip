
export const formatIndianPrice = (price: number): string => {
  // Format with Indian numbering system and ₹ symbol
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  // Replace the default symbol with proper rupee symbol
  return formatted.replace('₹', '₹');
};

export const formatPriceShort = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatRentalPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}/day`;
};
