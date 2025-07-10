
export const updateFormField = <T, K extends keyof T>(
  state: T,
  field: K,
  value: T[K]
): T => {
  return {
    ...state,
    [field]: value,
  };
};

// List of boolean fields
const booleanFields = [
  'acceptOffers',
  'phoneVerified',
  'termsAccepted',
  'authorizedServiceCenter',
  'rtoTransferSupport',
  'noAccidentHistory',
  'isRentAvailable',
  'insuranceValid',
  'serviceHistory',
  'whatsappContact',
  'installationAvailable',
  'agreeToTerms',
  'is24x7'
];

export const convertToBoolean = (value: any, fieldName: string): boolean => {
  if (booleanFields.includes(fieldName)) {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return !!value;
  }
  return value;
};
