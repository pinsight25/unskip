
export const dealersData = [
  {
    id: '1',
    name: 'CarMax Motors',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'contact@carmaxmotors.com',
    businessCategory: 'New & Used Cars',
    specialization: 'All Brands',
    location: 'Andheri West, Mumbai',
    city: 'Mumbai',
    establishmentYear: '2010',
    carsInStock: 0,
    verified: true,
    brands: ['Maruti Suzuki', 'Hyundai', 'Tata'],
    shopPhoto: 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=800&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Premium Auto Hub',
    contactPerson: 'Arjun Mehta',
    phone: '+91 98765 43211',
    email: 'arjun@premiumautohub.com',
    businessCategory: 'Specialized',
    specialization: 'Luxury Cars',
    location: 'Bandra East, Mumbai',
    city: 'Mumbai',
    establishmentYear: '2015',
    carsInStock: 0,
    verified: true,
    brands: ['BMW', 'Audi', 'Mercedes'],
    shopPhoto: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'City Car Center',
    contactPerson: 'Priya Sharma',
    phone: '+91 98765 43212',
    email: 'priya@citycarcentre.com',
    businessCategory: 'New & Used Cars',
    specialization: 'Budget Cars',
    location: 'Powai, Mumbai',
    city: 'Mumbai',
    establishmentYear: '2008',
    carsInStock: 0,
    verified: true,
    brands: ['Honda', 'Toyota', 'Nissan'],
    shopPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    name: 'Elite Motors',
    contactPerson: 'Suresh Patel',
    phone: '+91 98765 43213',
    email: 'suresh@elitemotors.com',
    businessCategory: 'Used Cars Only',
    specialization: 'All Brands',
    location: 'Goregaon West, Mumbai',
    city: 'Mumbai',
    establishmentYear: '2012',
    carsInStock: 0,
    verified: false,
    brands: ['Mahindra', 'Ford', 'Renault'],
    shopPhoto: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    name: 'Royal Car Palace',
    contactPerson: 'Vikram Singh',
    phone: '+91 98765 43214',
    email: 'vikram@royalcarpalace.com',
    businessCategory: 'New Cars Only',
    specialization: 'Electric',
    location: 'Thane West, Delhi',
    city: 'Delhi',
    establishmentYear: '2018',
    carsInStock: 0,
    verified: true,
    brands: ['Kia', 'Skoda', 'Volkswagen'],
    shopPhoto: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=200&fit=crop'
  },
  {
    id: '6',
    name: 'Metro Auto Sales',
    contactPerson: 'Ravi Kumar',
    phone: '+91 98765 43215',
    email: 'ravi@metroautosales.com',
    businessCategory: 'Used Cars Only',
    specialization: 'Budget Cars',
    location: 'Malad West, Bangalore',
    city: 'Bangalore',
    establishmentYear: '2005',
    carsInStock: 0,
    verified: true,
    brands: ['Jeep', 'MG', 'Tata'],
    shopPhoto: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=200&fit=crop'
  }
];

// Utility function for creating URL-friendly slugs
export const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// Find dealer by ID or slug
export const findDealerByIdOrSlug = (param: string) => {
  // Try to find by ID first
  let dealer = dealersData.find(d => d.id === param);
  
  // If not found by ID, try to find by slug
  if (!dealer) {
    dealer = dealersData.find(d => createSlug(d.name) === param);
  }

  return dealer;
};
