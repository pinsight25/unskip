
import { useState, useEffect } from 'react';
import { Car } from '@/types/car';

interface SearchFilters {
  query: string;
  priceRange: [number, number];
  selectedMake: string;
  selectedFuel: string[];
  selectedYear: string;
  sortBy: string;
}

export const useCarSearch = (cars: Car[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleSearch = () => {
    let filtered = cars;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query)
      );
    }

    // Price range filter
    filtered = filtered.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    // Make filter
    if (selectedMake) {
      filtered = filtered.filter(car => car.brand === selectedMake);
    }

    // Fuel type filter
    if (selectedFuel.length > 0) {
      filtered = filtered.filter(car => selectedFuel.includes(car.fuelType));
    }

    // Year filter
    if (selectedYear) {
      const year = parseInt(selectedYear);
      filtered = filtered.filter(car => car.year >= year);
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'year_desc':
            return b.year - a.year;
          case 'mileage_asc':
            return a.mileage - b.mileage;
          default:
            return 0;
        }
      });
    }

    setFilteredCars(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, priceRange, selectedMake, selectedFuel, selectedYear, sortBy]);

  const handleFuelToggle = (fuel: string) => {
    setSelectedFuel(prev => 
      prev.includes(fuel) 
        ? prev.filter(f => f !== fuel)
        : [...prev, fuel]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 5000000]);
    setSelectedMake('');
    setSelectedFuel([]);
    setSelectedYear('');
    setSortBy('');
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredCars,
    priceRange,
    setPriceRange,
    selectedMake,
    setSelectedMake,
    selectedFuel,
    handleFuelToggle,
    selectedYear,
    setSelectedYear,
    sortBy,
    setSortBy,
    clearFilters
  };
};
