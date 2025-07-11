
export const formatPrice = (price: number | { min: number; max: number }) => {
  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  } else {
    if (price.min === price.max) {
      return `₹${price.min.toLocaleString('en-IN')}`;
    }
    return `₹${price.min.toLocaleString('en-IN')} - ₹${price.max.toLocaleString('en-IN')}`;
  }
};

export const getStatusVariant = (status: string) => {
  const variants = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-blue-100 text-blue-800',
    expired: 'bg-gray-100 text-gray-800'
  };
  
  return variants[status as keyof typeof variants] || variants.active;
};

export const getStatusText = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
