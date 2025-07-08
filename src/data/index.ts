
// Main data exports - maintaining backward compatibility
export { sellers as unifiedSellers } from './sellers';
export { allCars as unifiedCars } from './cars';
export { getCarsForSale, getCarsForRent } from './carFilters';

// Individual category exports
export { economyCars, suvCars, luxuryCars } from './cars';
