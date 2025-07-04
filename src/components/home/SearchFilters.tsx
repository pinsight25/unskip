import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Car, Users, Building2, Sparkles, TrendingUp, Shield } from 'lucide-react';
import carSilhouettes from '@/assets/car-silhouettes.png';

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
    { key: 'all' as const, label: 'All Cars', icon: Car, count: '2.3k+', description: 'Browse everything' },
    { key: 'dealer' as const, label: 'Verified Dealers', icon: Building2, count: '850+', description: 'Professional sellers' },
    { key: 'individual' as const, label: 'Owners', icon: Users, count: '1.5k+', description: 'Direct from owners' }
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
    <div className="relative">
      {/* Modern Hero Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-light/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-32 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Car Silhouettes */}
      <div className="absolute top-16 right-8 opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        <img src={carSilhouettes} alt="" className="w-48 h-24 object-contain" />
      </div>
      <div className="absolute bottom-16 left-8 opacity-10 animate-float" style={{ animationDelay: '3s' }}>
        <img src={carSilhouettes} alt="" className="w-40 h-20 object-contain transform scale-x-[-1]" />
      </div>

      <div className="relative z-10 py-20 lg:py-32 px-4">
        <div className="container mx-auto text-center space-y-8">
          {/* Premium Hero Text */}
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm font-medium border border-white/20">
              <Sparkles className="h-4 w-4" />
              Chennai's #1 Car Marketplace
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight">
              Find Your
              <span className="block bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
                Perfect Car
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
              Discover thousands of verified cars from trusted dealers and owners. 
              <span className="font-medium text-white"> Premium quality, fair prices.</span>
            </p>
          </div>

          {/* Modern Search Card */}
          <Card className="max-w-4xl mx-auto glass-card shadow-premium animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Main Search */}
                <div className="flex gap-3">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search by brand, model, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-lg border-2 border-border focus:border-primary bg-white/80 backdrop-blur-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="premium-gradient px-8 h-12 text-lg font-semibold hover:shadow-glow transition-all duration-300"
                  >
                    Search
                  </Button>
                </div>

                {/* Quick Locations */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Popular areas:</span>
                  </div>
                  {['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'].map((location) => (
                    <Badge 
                      key={location}
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 bg-white/60 backdrop-blur-sm border-border/50"
                      onClick={() => setSearchQuery(location)}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {filterTypes.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeType === filter.key;
              return (
                <Card
                  key={filter.key}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-premium group ${
                    isActive 
                      ? 'glass-card shadow-premium ring-2 ring-primary' 
                      : 'bg-white/80 backdrop-blur-sm hover:bg-white/90'
                  }`}
                  onClick={() => handleTypeChange(filter.key)}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 ${
                      isActive ? 'premium-gradient text-white' : 'bg-secondary text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{filter.label}</h3>
                      <p className="text-sm text-muted-foreground">{filter.description}</p>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {filter.count}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: Car, value: '2,300+', label: 'Verified Cars', color: 'text-primary' },
              { icon: Shield, value: '50,000+', label: 'Happy Customers', color: 'text-success' },
              { icon: TrendingUp, value: '150+', label: 'Trusted Dealers', color: 'text-accent' }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-white/10 backdrop-blur-md border border-white/20`}>
                    <Icon className={`h-8 w-8 text-white`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
                    <p className="text-white/80 font-medium">{metric.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;