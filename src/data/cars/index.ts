
import { Car } from '@/types/car';
import { economyCars } from './economyCars';
import { suvCars } from './suvCars';
import { luxuryCars } from './luxuryCars';

// Combine all car categories
export const allCars: Car[] = [
  ...economyCars,
  ...suvCars,
  ...luxuryCars
];

// Export individual categories for easier access
export { economyCars, suvCars, luxuryCars };
