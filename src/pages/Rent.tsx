
import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RentCarCard from '@/components/rent/RentCarCard';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Search } from 'lucide-react';
import { RentCar } from '@/types/rent';
import { mockRentCars } from '@/data/rentMockData';

interface CarType {
  id: string;
  label: string;
}

interface RentFilters {
  search: string;
  carType: string | null;
  dailyPriceRange: [number, number];
  duration: 'all' | 'daily' | 'weekly' | 'monthly';
  availableFrom: Date | undefined;
  availableTo: Date | undefined;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'newest';
}

const Rent = () => {
  const [filters, setFilters] = useState<RentFilters>({
    search: '',
    carType: null,
    dailyPriceRange: [0, 5000],
    duration: 'all',
    availableFrom: undefined,
    availableTo: undefined,
    sortBy: 'relevance',
  });

  const [filteredCars, setFilteredCars] = useState<RentCar[]>(mockRentCars);

  useEffect(() => {
    let filtered = mockRentCars.filter((car) => {
      const searchRegex = new RegExp(filters.search, 'i');
      return searchRegex.test(car.title);
    });

    if (filters.carType) {
      filtered = filtered.filter((car) => car.rentType === filters.carType);
    }

    filtered = filtered.sort((a, b) => {
      if (filters.sortBy === 'price_low') {
        return a.rentPrice.daily - b.rentPrice.daily;
      } else if (filters.sortBy === 'price_high') {
        return b.rentPrice.daily - a.rentPrice.daily;
      } else if (filters.sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

    setFilteredCars(filtered);
  }, [filters]);

  const carTypes: CarType[] = [
    { id: 'economy', label: 'Economy' },
    { id: 'premium', label: 'Premium' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'suv', label: 'SUV' },
  ];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-40">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent a Car</h1>
              <p className="text-gray-600">Find the perfect car for your journey</p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 max-w-4xl mx-auto mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by make, model, or location..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg"
                />
              </div>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 h-12">
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              {carTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilters(prev => ({ ...prev, carType: type.id }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filters.carType === type.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white border-b border-gray-100 py-4">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Price Range
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.dailyPriceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dailyPriceRange: [Number(e.target.value), prev.dailyPriceRange[1]] as [number, number]
                    }))}
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.dailyPriceRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dailyPriceRange: [prev.dailyPriceRange[0], Number(e.target.value)] as [number, number]
                    }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Any Duration</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Available From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <Input
                  type="date"
                  value={filters.availableFrom?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    availableFrom: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="text-sm"
                />
              </div>

              {/* Available To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available To
                </label>
                <Input
                  type="date"
                  value={filters.availableTo?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    availableTo: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredCars.length} Cars Available for Rent
              </h2>
              <p className="text-sm text-gray-600">
                Starting from {formatPrice(1500)}/day
              </p>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Car Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <RentCarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Rent;
