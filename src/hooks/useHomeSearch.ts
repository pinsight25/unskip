
import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';

interface SearchState {
  isSearching: boolean;
  query: string;
  results: Car[];
  resultCount: number;
}

export const useHomeSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    isSearching: false,
    query: '',
    results: [],
    resultCount: 0
  });

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchState({
        isSearching: false,
        query: '',
        results: [],
        resultCount: 0
      });
      return;
    }

    const searchQuery = query.toLowerCase();
    const filteredResults = mockCars.filter(car => 
      car.title.toLowerCase().includes(searchQuery) ||
      car.brand.toLowerCase().includes(searchQuery) ||
      car.model.toLowerCase().includes(searchQuery) ||
      car.location.toLowerCase().includes(searchQuery) ||
      car.seller.name.toLowerCase().includes(searchQuery)
    );

    setSearchState({
      isSearching: true,
      query: query,
      results: filteredResults,
      resultCount: filteredResults.length
    });
  };

  const clearSearch = () => {
    setSearchState({
      isSearching: false,
      query: '',
      results: [],
      resultCount: 0
    });
  };

  return {
    ...searchState,
    performSearch,
    clearSearch
  };
};
