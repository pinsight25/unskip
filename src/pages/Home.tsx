
import { useState, useEffect } from 'react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import SearchFilters from '@/components/home/SearchFilters';
import CarCard from '@/components/car/CarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Car as CarIcon, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchFiltersType {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

const Home = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    query: '',
    type: 'all',
    priceRange: [0, 5000000],
    location: ''
  });
  const { toast } = useToast();

  const handleFilterChange = (filters: SearchFiltersType) => {
    setCurrentFilters(filters);
    
    let filtered = cars;
    
    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(car => car.seller.type === filters.type);
    }
    
    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(car => 
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredCars(filtered);
  };

  const sortOptions = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Year: Newest First', value: 'year_desc' },
    { label: 'Mileage: Low to High', value: 'mileage_asc' }
  ];

  const handleSort = (sortValue: string) => {
    const sorted = [...filteredCars].sort((a, b) => {
      switch (sortValue) {
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
    setFilteredCars(sorted);
  };

  const handleSaveCar = (carId: string) => {
    setSavedCars(prev => {
      const isAlreadySaved = prev.includes(carId);
      if (isAlreadySaved) {
        toast({
          title: "Car removed from wishlist",
          description: "Car has been removed from your saved cars.",
        });
        return prev.filter(id => id !== carId);
      } else {
        toast({
          title: "Car saved to wishlist",
          description: "Car has been added to your saved cars.",
        });
        return [...prev, carId];
      }
    });
  };

  // Sort by featured and verified first by default
  useEffect(() => {
    const sorted = [...cars].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });
    setCars(sorted);
    setFilteredCars(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-16">
        <SearchFilters onFilterChange={handleFilterChange} />
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <CarIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  {filteredCars.length} Cars Available
                </h2>
                {currentFilters.type !== 'all' && (
                  <Badge variant="outline" className="text-primary border-primary">
                    {currentFilters.type === 'dealer' ? 'Dealers' : 'Individual Owners'}
                  </Badge>
                )}
                {savedCars.length > 0 && (
                  <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                    <Heart className="h-3 w-3 mr-1 fill-current" />
                    {savedCars.length} saved
                  </Badge>
                )}
              </div>
              {currentFilters.query && (
                <p className="text-muted-foreground">
                  Showing results for "{currentFilters.query}"
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                onChange={(e) => handleSort(e.target.value)}
                className="border border-border rounded-md px-3 py-2 text-sm bg-background hover:bg-muted/50 transition-colors"
              >
                <option value="">Sort by</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(currentFilters.query || currentFilters.type !== 'all') && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {currentFilters.query && (
                <Badge variant="secondary">
                  Search: {currentFilters.query}
                </Badge>
              )}
              {currentFilters.type !== 'all' && (
                <Badge variant="secondary">
                  {currentFilters.type === 'dealer' ? 'Dealers' : 'Individual Owners'}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' })}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Car Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  onSave={handleSaveCar}
                  isSaved={savedCars.includes(car.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more cars.
              </p>
              <Button 
                variant="outline"
                onClick={() => handleFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' })}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredCars.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Cars
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
