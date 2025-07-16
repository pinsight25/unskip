export const formatPhoneForDB = (phone: string): string => {
  if (!phone) return '';
  // Remove leading + if present, but keep 91 country code
  return phone.replace(/^\+/, '').replace(/\s+/g, '').trim();
};

export const formatPhoneForAuth = (phone: string): string => {
  let formatted = phone.replace(/\s+/g, '').replace(/-/g, '');
  if (!formatted.startsWith('+91')) {
    formatted = '+91' + formatted;
  }
  return formatted;
}; 