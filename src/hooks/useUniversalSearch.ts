
import { useState, useMemo } from 'react';
import { Car } from '@/types/car';
import { Accessory } from '@/types/accessory';

interface SearchFilters {
  query: string;
  priceRange: [number, number];
  location: string;
  fuelType: string[];
  transmission: string[];
  yearRange: [number, number];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest';
}

export const useUniversalSearch = (data: Car[] | Accessory[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    priceRange: [0, 5000000],
    location: '',
    fuelType: [],
    transmission: [],
    yearRange: [2000, 2024],
    sortBy: 'relevance'
  });

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(item => {
        // Type guard to check if it's a Car
        if ('title' in item && 'brand' in item && 'model' in item) {
          const car = item as Car;
          return (
            car.title.toLowerCase().includes(query) ||
            car.brand.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.location.toLowerCase().includes(query)
          );
        } else {
          // It's an Accessory
          const accessory = item as Accessory;
          return (
            accessory.name.toLowerCase().includes(query) ||
            accessory.brand.toLowerCase().includes(query) ||
            accessory.category.toLowerCase().includes(query)
          );
        }
      });
    }

    // Price range filter
    filtered = filtered.filter(item => {
      // Type guard for price handling
      if ('price' in item && typeof item.price === 'number') {
        const car = item as Car;
        return car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1];
      } else if ('price' in item && typeof item.price === 'object') {
        const accessory = item as Accessory;
        return accessory.price.min >= filters.priceRange[0] && accessory.price.max <= filters.priceRange[1];
      }
      return true;
    });

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => {
        if ('location' in item) {
          const car = item as Car;
          return car.location.toLowerCase().includes(filters.location.toLowerCase());
        } else {
          const accessory = item as Accessory;
          return accessory.location.toLowerCase().includes(filters.location.toLowerCase());
        }
      });
    }

    // Car-specific filters - only apply if we're dealing with cars
    if (data.length > 0 && 'fuelType' in data[0]) {
      const carData = filtered as Car[];
      
      // Fuel type filter
      if (filters.fuelType.length > 0) {
        filtered = carData.filter(car => 
          filters.fuelType.includes(car.fuelType)
        );
      }

      // Transmission filter
      if (filters.transmission.length > 0) {
        filtered = carData.filter(car => 
          filters.transmission.includes(car.transmission)
        );
      }

      // Year range filter
      filtered = carData.filter(car => 
        car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1]
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          const priceA = 'price' in a && typeof a.price === 'number' ? a.price : ('price' in a ? (a as Accessory).price.min : 0);
          const priceB = 'price' in b && typeof b.price === 'number' ? b.price : ('price' in b ? (b as Accessory).price.min : 0);
          return priceA - priceB;
        case 'price-high':
          const priceHighA = 'price' in a && typeof a.price === 'number' ? a.price : ('price' in a ? (a as Accessory).price.max : 0);
          const priceHighB = 'price' in b && typeof b.price === 'number' ? b.price : ('price' in b ? (b as Accessory).price.max : 0);
          return priceHighB - priceHighA;
        case 'newest':
          if ('year' in a && 'year' in b) {
            return (b as Car).year - (a as Car).year;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      priceRange: [0, 5000000],
      location: '',
      fuelType: [],
      transmission: [],
      yearRange: [2000, 2024],
      sortBy: 'relevance'
    });
  };

  return {
    filters,
    filteredData,
    updateFilter,
    clearFilters,
    resultCount: filteredData.length
  };
};
