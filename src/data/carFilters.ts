
import { Car } from '@/types/car';
import { allCars } from './cars';

// Filter cars for sale (all cars)
export const getCarsForSale = (): Car[] => {
  return allCars;
};

// Filter cars available for rent
export const getCarsForRent = (): Car[] => {
  return allCars.filter(car => car.isRentAvailable);
};
