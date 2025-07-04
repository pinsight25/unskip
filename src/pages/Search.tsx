import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { mockCars } from '@/data/mockData';
import { Car } from '@/types/car';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const makes = [...new Set(cars.map(car => car.brand))];

  return (
    <ResponsiveLayout>
      <div className="bg-white">
        {/* Search Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Advanced Search</h1>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search cars by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-primary"
              />
            </div>
            
            {/* Active Filters */}
            {(selectedMake || selectedFuel.length > 0 || selectedYear || priceRange[0] > 0 || priceRange[1] < 5000000) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMake && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {selectedMake}
                    <button 
                      onClick={() => setSelectedMake('')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedFuel.map(fuel => (
                  <Badge key={fuel} variant="secondary" className="bg-primary/10 text-primary">
                    {fuel}
                    <button 
                      onClick={() => handleFuelToggle(fuel)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedYear && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {selectedYear}+ Year
                    <button 
                      onClick={() => setSelectedYear('')}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-80 flex-shrink-0">
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min (₹)" 
                        value={priceRange[0] || ''}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="text-sm"
                      />
                      <Input 
                        type="number" 
                        placeholder="Max (₹)" 
                        value={priceRange[1] === 5000000 ? '' : priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000000])}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Make */}
                  <div>
                    <h4 className="font-medium mb-2">Make</h4>
                    <select 
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="">All Makes</option>
                      {makes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <h4 className="font-medium mb-2">Year</h4>
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    >
                      <option value="">Any Year</option>
                      <option value="2020">2020 & Newer</option>
                      <option value="2018">2018 & Newer</option>
                      <option value="2015">2015 & Newer</option>
                      <option value="2010">2010 & Newer</option>
                    </select>
                  </div>
                  
                  {/* Fuel Type */}
                  <div>
                    <h4 className="font-medium mb-2">Fuel Type</h4>
                    <div className="space-y-2">
                      {['Petrol', 'Diesel', 'CNG', 'Electric'].map((fuel) => (
                        <label key={fuel} className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedFuel.includes(fuel)}
                            onChange={() => handleFuelToggle(fuel)}
                          />
                          <span className="text-sm">{fuel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={clearFilters}
                    variant="outline" 
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            </div>

            {/* Results Area */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Search Results</h2>
                  <p className="text-gray-600">{filteredCars.length} cars found</p>
                </div>
                
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value="">Sort by: Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest First</option>
                  <option value="mileage_asc">Mileage: Best First</option>
                </select>
              </div>
              
              {/* Search Results Grid */}
              {filteredCars.length > 0 ? (
                <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                  {filteredCars.map((car) => (
                    isMobile ? (
                      <MobileCarCard 
                        key={car.id} 
                        car={car} 
                        onSave={() => {}}
                        isSaved={false}
                        onMakeOffer={() => {}}
                        onChat={() => {}}
                        onTestDrive={() => {}}
                      />
                    ) : (
                      <CarCard 
                        key={car.id} 
                        car={car} 
                        onSave={() => {}}
                        isSaved={false}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Search;
