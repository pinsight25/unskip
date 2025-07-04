
export const formatIndianPrice = (price: number): string => {
  // Convert to string and reverse for easier processing
  const priceStr = price.toString();
  const reversed = priceStr.split('').reverse();
  
  // Add commas in Indian format
  const formatted = [];
  for (let i = 0; i < reversed.length; i++) {
    if (i === 3) {
      formatted.push(',');
    } else if (i > 3 && (i - 3) % 2 === 0) {
      formatted.push(',');
    }
    formatted.push(reversed[i]);
  }
  
  return '₹' + formatted.reverse().join('');
};

export const formatRentalPrice = (price: number): string => {
  return `₹${price.toLocaleString()}/day`;
};
