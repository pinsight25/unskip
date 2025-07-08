
import { getCarsForSale, unifiedSellers } from './index';

export const mockSellers = unifiedSellers;
export const mockCars = getCarsForSale();

export const pricingTiers = {
  dealer: {
    free: {
      name: 'Free Plan',
      price: 0,
      features: [
        'List up to 5 cars',
        'Basic photo upload',
        'Standard support',
        'Basic analytics'
      ]
    },
    premium: [
      {
        name: 'Priority Placement',
        price: 500,
        period: 'month',
        description: 'Your listings appear at the top of search results'
      },
      {
        name: 'Featured Listings',
        price: 200,
        period: 'listing',
        description: 'Highlight individual cars with special badges'
      },
      {
        name: 'Bulk Upload',
        price: 300,
        period: 'month',
        description: 'Upload multiple cars at once via CSV'
      },
      {
        name: 'Advanced Analytics',
        price: 400,
        period: 'month',
        description: 'Detailed insights on views, leads, and performance'
      }
    ]
  }
};
