
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Car, Users, Building2, Sparkles, TrendingUp, Shield, Star } from 'lucide-react';

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
  const [offerCount, setOfferCount] = useState(247);
  
  const filterTypes = [
    { key: 'all' as const, label: 'Browse Everything', icon: Car, count: '2.3k+', description: 'All available cars' },
    { key: 'dealer' as const, label: 'Verified Dealers', icon: Building2, count: '850+', description: 'Professional sellers' },
    { key: 'individual' as const, label: 'Direct from Owners', icon: Users, count: '1.5k+', description: 'Individual owners' }
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

  // Animated counting effect
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

    // Simulate real-time offer counter
    const offerTimer = setInterval(() => {
      setOfferCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => {
      observer.disconnect();
      clearInterval(offerTimer);
    };
  }, []);

  return (
    <div className="relative">
      {/* Softer Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/60 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5" />

      <div className="relative z-10 py-12 lg:py-16 px-4">
        <div className="container mx-auto text-center space-y-10">
          {/* Enhanced Hero Text with Trust Elements */}
          <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm font-medium border border-white/30">
              <Sparkles className="h-4 w-4" />
              Find Your Perfect Car
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Smart Car Shopping
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
              Connect with verified sellers • Fair pricing • Quality guaranteed
            </p>

            {/* Live Activity Counter */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm font-medium border border-white/20">
              <TrendingUp className="h-4 w-4 text-green-300" />
              {offerCount} offers made today • 5 cars sold today
            </div>
          </div>

          {/* Enhanced Search Card with Better Prominence */}
          <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Large Prominent Search */}
                <div className="flex gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      placeholder="Search by make, model, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-14 h-14 text-base border-2 border-border focus:border-primary bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    size="lg"
                    className="premium-gradient px-8 h-14 text-base font-semibold hover:shadow-glow transition-all duration-300 text-white border-0 rounded-lg"
                  >
                    Search Cars
                  </Button>
                </div>

                {/* Enhanced Popular Locations with Better Visibility */}
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>Popular areas:</span>
                  </div>
                  {['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'].map((location) => (
                    <Badge 
                      key={location}
                      className="cursor-pointer bg-white text-gray-800 border-2 border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 px-4 py-2 font-semibold rounded-full hover:scale-105 shadow-md hover:shadow-lg"
                      onClick={() => setSearchQuery(location)}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Filter Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {filterTypes.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeType === filter.key;
              return (
                <Card
                  key={filter.key}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl group hover:-translate-y-2 ${
                    isActive 
                      ? 'bg-white shadow-xl ring-2 ring-primary scale-105' 
                      : 'bg-white hover:shadow-lg'
                  }`}
                  onClick={() => handleTypeChange(filter.key)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${
                      isActive ? 'premium-gradient text-white shadow-lg' : 'bg-secondary/20 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-foreground">{filter.label}</h3>
                      <p className="text-sm text-muted-foreground">{filter.description}</p>
                    </div>
                    <Badge variant="outline" className="font-semibold text-primary border-primary/30">
                      {filter.count}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhanced Statistics with Better Impact */}
          <div id="stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: Car, value: animatedCounts.cars, suffix: '+', label: 'Verified Cars', color: 'text-primary' },
              { icon: Shield, value: animatedCounts.customers, suffix: '+', label: 'Happy Customers', color: 'text-success' },
              { icon: Star, value: animatedCounts.dealers, suffix: '+', label: 'Trusted Dealers', color: 'text-accent' }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center space-y-4 group">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto bg-white/20 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-5xl font-black text-white tracking-tight">
                      {metric.value.toLocaleString()}{metric.suffix}
                    </h3>
                    <p className="text-white/90 font-semibold text-lg">{metric.label}</p>
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
