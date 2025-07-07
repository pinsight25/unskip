
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockRentCars } from '@/data/rentMockData';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Car, MapPin, Calendar, Shield, Star, Heart, Filter } from 'lucide-react';
import { Car as CarType } from '@/types/car';

// Simple search hook specifically for rent cars
const useRentSearch = (data: CarType[]) => {
  const [filters, setFilters] = useState({
    query: '',
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'newest'
  });

  const filteredData = data.filter(car => {
    if (!filters.query.trim()) return true;
    const query = filters.query.toLowerCase();
    return (
      car.title.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.location.toLowerCase().includes(query)
    );
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return (a.rentPrice?.daily || 0) - (b.rentPrice?.daily || 0);
      case 'price-high':
        return (b.rentPrice?.daily || 0) - (a.rentPrice?.daily || 0);
      case 'newest':
        return b.year - a.year;
      default:
        return 0;
    }
  });

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ query: '', sortBy: 'relevance' });
  };

  return {
    filters,
    filteredData,
    updateFilter,
    clearFilters,
    resultCount: filteredData.length
  };
};

const Rent = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const { filters, filteredData, updateFilter, clearFilters, resultCount } = useRentSearch(mockRentCars);

  const handleSave = (carId: string) => {
    setSavedCars(prev =>
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
    
    toast({
      title: savedCars.includes(carId) ? "Removed from Saved" : "Added to Saved",
      description: savedCars.includes(carId) ? "Car removed from wishlist" : "Car added to wishlist",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <ResponsiveLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="container mx-auto mobile-page-container-fixed">
            <div className="text-center py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Rent Cars by the Day
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Choose from {mockRentCars.length} verified rental cars
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    placeholder="Search by location, car model, or brand..."
                    value={filters.query}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    className="h-12 pl-12 pr-4 text-base"
                  />
                  <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="mt-6">
                <Link to="/list-car-for-rent">
                  <Button size="lg" className="touch-target-button">
                    List Your Car for Rent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container mx-auto mobile-page-container-fixed">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {resultCount} cars available
                </h2>
                {filters.query && (
                  <Badge variant="outline" className="bg-blue-50">
                    "{filters.query}"
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!filters.query}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Car Grid */}
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.map((car) => (
                  <Card key={car.id} className="overflow-hidden hover-lift cards-equal-height">
                    <div className="relative">
                      <img
                        src={car.images[0]}
                        alt={car.title}
                        className="w-full aspect-[4/3] object-cover"
                        loading="lazy"
                      />
                      <button
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors touch-target"
                        onClick={() => handleSave(car.id)}
                      >
                        <Heart 
                          className={`h-5 w-5 ${
                            savedCars.includes(car.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </button>
                      {car.verified && (
                        <Badge className="absolute top-3 left-3 bg-green-500">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
                        {car.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {car.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Min {car.rentPolicies?.minRentalPeriod || 1} day{(car.rentPolicies?.minRentalPeriod || 1) > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                          {car.seller.rating} • {car.seller.totalSales} trips
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-blue-600">
                              {formatPrice(car.rentPrice?.daily || 0)}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">/day</span>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {car.rentType || 'economy'}
                          </Badge>
                        </div>
                        
                        <Link to={`/car/${car.id}`}>
                          <Button className="w-full touch-target-button">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center max-w-md mx-auto">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No cars found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or clearing filters
                </p>
                <Button onClick={clearFilters} className="touch-target-button">
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Rent;
