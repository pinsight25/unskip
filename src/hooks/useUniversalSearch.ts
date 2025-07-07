
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
        if ('title' in item) {
          // Car search
          return (
            item.title.toLowerCase().includes(query) ||
            item.brand.toLowerCase().includes(query) ||
            item.model.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query)
          );
        } else {
          // Accessory search
          return (
            item.name.toLowerCase().includes(query) ||
            item.brand.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
          );
        }
      });
    }

    // Price range filter
    filtered = filtered.filter(item => {
      const price = 'price' in item ? item.price : item.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => {
        const location = 'location' in item ? item.location : item.seller.location;
        return location.toLowerCase().includes(filters.location.toLowerCase());
      });
    }

    // Car-specific filters
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
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          if ('year' in a && 'year' in b) {
            return b.year - a.year;
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
