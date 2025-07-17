export const formatPhoneForDB = (phone: string): string => {
  if (!phone) return '';
  // Remove leading + if present, but keep 91 country code
  return phone.replace(/^\+/, '').replace(/\s+/g, '').trim();
};

export const formatPhoneForAuth = (phone: string): string => {
  let formatted = phone.replace(/\s+/g, '').replace(/-/g, '');
  // Remove all leading + and 91
  formatted = formatted.replace(/^\+?91/, '');
  return '+91' + formatted;
}; 