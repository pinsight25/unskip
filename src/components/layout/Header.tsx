
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Car, Search, Menu, X, Shield, User, TrendingUp } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [carsSoldToday, setCarsSoldToday] = useState(5);
  const location = useLocation();

  const navItems = [
    { label: 'Buy Cars', path: '/' },
    { label: 'Sell', path: '/sell' },
    { label: 'Dealers', path: '/dealers' },
    { label: 'Rent', path: '/rent' }
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Simulate live car sales counter
    const salesTimer = setInterval(() => {
      setCarsSoldToday(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 120000); // Update every 2 minutes

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(salesTimer);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/96 backdrop-blur-md shadow-card border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo with Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 premium-gradient rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-premium transition-all duration-300 group-hover:scale-110">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">CarVibe</span>
              <span className="text-xs text-muted-foreground -mt-1 font-medium hidden sm:block">Chennai's #1 Car Marketplace</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary relative ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-premium rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Enhanced CTA & Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Live Sales Counter */}
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 transition-colors">
              <TrendingUp className="h-3 w-3 mr-1" />
              {carsSoldToday} cars sold today
            </Badge>

            <Badge variant="secondary" className="bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors">
              <Shield className="h-3 w-3 mr-1" />
              Trusted Platform
            </Badge>
            
            {/* Profile Avatar */}
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Sign In</span>
            </div>
            
            {/* Enhanced Post Car Button with Animation */}
            <Button size="sm" className="premium-gradient hover:shadow-glow transition-all duration-300 font-bold px-8 text-white border-0 relative overflow-hidden group animate-pulse">
              <span className="relative z-10">Post Your Car</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 bg-white/96 backdrop-blur-md animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 self-start">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {carsSoldToday} cars sold today
                </Badge>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 self-start">
                  <Shield className="h-3 w-3 mr-1" />
                  Trusted Platform
                </Badge>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button size="sm" className="w-full premium-gradient font-semibold">
                  Post Your Car
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
