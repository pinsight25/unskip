
import { useState, useMemo } from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { mockRentCars } from '@/data/rentMockData';
import { RentFilters } from '@/types/rent';
import { Button } from '@/components/ui/button';
import CTAButton from '@/components/ui/CTAButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import RentCarCard from '@/components/rent/RentCarCard';
import { Search, Filter, CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Rent = () => {
  const [filters, setFilters] = useState<RentFilters>({
    search: '',
    dailyPriceRange: [1000, 10000],
    duration: 'all',
    carType: 'all',
    availableFrom: undefined,
    availableTo: undefined,
    sortBy: 'relevance'
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredCars = useMemo(() => {
    let filtered = mockRentCars;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(car =>
        car.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Daily price filter
    filtered = filtered.filter(car => 
      car.rentPrice.daily >= filters.dailyPriceRange[0] && 
      car.rentPrice.daily <= filters.dailyPriceRange[1]
    );

    // Car type filter
    if (filters.carType !== 'all') {
      filtered = filtered.filter(car => car.rentType === filters.carType);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.rentPrice.daily - b.rentPrice.daily);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.rentPrice.daily - a.rentPrice.daily);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // Relevance - featured first
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.views - a.views;
        });
    }

    return filtered;
  }, [filters]);

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section - Standardized spacing */}
        <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-4xl font-bold mb-3 text-gray-900">
                Rent Premium Cars
              </h1>
              <p className="text-base lg:text-lg text-gray-600 mb-4">
                Drive your dream car by the day, week, or month
              </p>
              
              {/* PRIMARY CTA Button */}
              <CTAButton 
                variant="primary"
                size="lg"
                className="mb-6 shadow-xl hover:shadow-2xl"
              >
                <Plus className="h-5 w-5" />
                List Your Car for Rent
              </CTAButton>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search cars by brand, model, or location..."
                  className="pl-12 pr-4 h-11 lg:h-14 text-base border-2 border-gray-200 focus:border-primary bg-white shadow-sm rounded-lg"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
              {[
                { id: 'all', name: 'All Cars', icon: '🚗' },
                { id: 'economy', name: 'Economy', icon: '💰' },
                { id: 'premium', name: 'Premium', icon: '⭐' },
                { id: 'luxury', name: 'Luxury', icon: '👑' },
                { id: 'suv', name: 'SUV', icon: '🚙' }
              ].map((type) => (
                <Button
                  key={type.id}
                  variant={filters.carType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, carType: type.id as any }))}
                  className="px-3 lg:px-4 py-2 min-h-[40px] lg:min-h-[44px] font-medium text-sm"
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Standardized spacing */}
        <div className="container mx-auto px-4 py-6">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available for rent
              </h2>
              <p className="text-sm lg:text-base text-gray-600">Perfect cars for your next adventure</p>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto">
              {/* Mobile Filters Toggle */}
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              {/* Sort */}
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block mb-6 p-6 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Daily Price Range
                </label>
                <Slider
                  value={filters.dailyPriceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, dailyPriceRange: value as [number, number] }))}
                  max={10000}
                  min={1000}
                  step={500}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{filters.dailyPriceRange[0].toLocaleString()}</span>
                  <span>₹{filters.dailyPriceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rental Duration
                </label>
                <Select 
                  value={filters.duration} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available From
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.availableFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.availableFrom ? format(filters.availableFrom, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.availableFrom}
                      onSelect={(date) => setFilters(prev => ({ ...prev, availableFrom: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    search: '',
                    dailyPriceRange: [1000, 10000] as [number, number],
                    duration: 'all',
                    carType: 'all',
                    availableFrom: undefined,
                    availableTo: undefined,
                    sortBy: 'relevance'
                  })}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <RentCarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Empty State */}
          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No cars found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters to find the perfect rental car
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setFilters({
                  search: '',
                  dailyPriceRange: [1000, 10000] as [number, number],
                  duration: 'all',
                  carType: 'all',
                  availableFrom: undefined,
                  availableTo: undefined,
                  sortBy: 'relevance'
                })}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Rent;
