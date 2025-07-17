export interface Dealer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessCategory: string;
  specialization: string;
  location: string;
  city?: string;
  establishmentYear: string;
  carsInStock: number;
  verified: boolean;
  brands: string[];
  shopPhoto?: string;
  verification_status?: string;
  slug: string;
} 