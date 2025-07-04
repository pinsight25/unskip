
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Car, Users, Building2, Star, Shield, TrendingUp } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  type: 'all' | 'dealer' | 'individual';
  priceRange: [number, number];
  location: string;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [activeType, setActiveType] = useState<'all' | 'dealer' | 'individual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedCounts, setAnimatedCounts] = useState({ cars: 0, customers: 0, dealers: 0 });
  
  const filterTypes = [
    { key: 'all' as const, label: 'All Cars', icon: Car, count: '2.3k+' },
    { key: 'dealer' as const, label: 'Dealers Only', icon: Building2, count: '850+' },
    { key: 'individual' as const, label: 'Owner Cars', icon: Users, count: '1.5k+' }
  ];

  const handleTypeChange = (type: 'all' | 'dealer' | 'individual') => {
    setActiveType(type);
    onFilterChange({
      query: searchQuery,
      type,
      priceRange: [0, 5000000],
      location: ''
    });
  };

  const handleSearch = () => {
    onFilterChange({
      query: searchQuery,
      type: activeType,
      priceRange: [0, 5000000],
      location: ''
    });
  };

  const handleLocationClick = (location: string) => {
    setSearchQuery(location);
    onFilterChange({
      query: location,
      type: activeType,
      priceRange: [0, 5000000],
      location: ''
    });
  };

  useEffect(() => {
    const animateCount = (target: number, key: 'cars' | 'customers' | 'dealers') => {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setAnimatedCounts(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(2300, 'cars');
          animateCount(50000, 'customers');
          animateCount(150, 'dealers');
          observer.disconnect();
        }
      });
    });

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-white py-6 lg:py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by make, model, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base border-2 border-border focus:border-primary bg-white shadow-sm rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg"
                className="bg-primary px-6 h-12 text-base font-medium hover:bg-primary/90 text-white rounded-lg"
              >
                Search
              </Button>
            </div>

            {/* Popular Locations */}
            <div className="overflow-x-auto">
              <div className="flex items-center gap-3 min-w-max">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium whitespace-nowrap">
                  <MapPin className="h-4 w-4" />
                  <span>Popular:</span>
                </div>
                <div className="flex gap-2">
                  {['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'].map((location) => (
                    <Badge 
                      key={location}
                      className="cursor-pointer bg-white text-gray-700 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 px-3 py-1.5 font-medium rounded-lg hover:shadow-sm whitespace-nowrap"
                      onClick={() => handleLocationClick(location)}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Row */}
          <div id="stats-section" className="overflow-x-auto">
            <div className="flex gap-6 min-w-max justify-center">
              {[
                { icon: Car, value: animatedCounts.cars, suffix: '+', label: 'Cars', color: 'text-primary' },
                { icon: Shield, value: animatedCounts.customers, suffix: '+', label: 'Customers', color: 'text-success' },
                { icon: Star, value: animatedCounts.dealers, suffix: '+', label: 'Dealers', color: 'text-accent' }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center space-y-2 min-w-[100px]">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto bg-gray-50">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {metric.value.toLocaleString()}{metric.suffix}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 overflow-x-auto">
              {filterTypes.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeType === filter.key;
                return (
                  <button
                    key={filter.key}
                    onClick={() => handleTypeChange(filter.key)}
                    className={`flex items-center gap-2 pb-3 px-1 font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${
                      isActive 
                        ? 'text-primary border-primary' 
                        : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{filter.label}</span>
                    <Badge variant="outline" className={`text-xs ${isActive ? 'border-primary/30 text-primary/70' : 'border-gray-300 text-gray-500'}`}>
                      {filter.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
