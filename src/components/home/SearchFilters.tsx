import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MapPin, Car, Users, Building2 } from 'lucide-react';

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
  
  const filterTypes = [
    { key: 'all' as const, label: 'All Cars', icon: Car, count: '2.3k+' },
    { key: 'dealer' as const, label: 'Dealers', icon: Building2, count: '850+' },
    { key: 'individual' as const, label: 'Individual Owners', icon: Users, count: '1.5k+' }
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

  return (
    <div className="space-y-6">
      {/* Hero Search Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Find Your Perfect Car
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover thousands of verified cars from trusted dealers and individual owners in Chennai
        </p>
        
        {/* Main Search Bar */}
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-gradient-primary px-6"
              >
                Search
              </Button>
            </div>
            
            {/* Quick Location Suggestions */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery'].map((location) => (
                <Badge 
                  key={location}
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setSearchQuery(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-muted p-1 rounded-lg">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.key}
                onClick={() => handleTypeChange(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeType === filter.key
                    ? 'bg-white shadow-sm text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
                <Badge variant="outline" className="ml-1">
                  {filter.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Car className="h-6 w-6 text-success" />
          </div>
          <h3 className="font-semibold">2,300+ Cars</h3>
          <p className="text-sm text-muted-foreground">Verified listings</p>
        </div>
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">50,000+ Users</h3>
          <p className="text-sm text-muted-foreground">Trust our platform</p>
        </div>
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold">150+ Dealers</h3>
          <p className="text-sm text-muted-foreground">Verified partners</p>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;