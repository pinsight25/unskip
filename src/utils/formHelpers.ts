export const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  if (value === 'indeterminate') return false; // Handle Radix checkbox indeterminate state
  return Boolean(value);
};

export const updateFormField = <T extends Record<string, any>>(
  formData: T,
  field: keyof T,
  value: any
): T => {
  const booleanFields = [
    'agreeToTerms', 'termsAccepted', 'isRentAvailable', 'acceptOffers',
    'insuranceValid', 'serviceHistory', 'rtoTransferSupport', 'noAccidentHistory'
  ];
  if (booleanFields.includes(field as string)) {
    return { ...formData, [field]: toBoolean(value) };
  }
  return { ...formData, [field]: value };
};
