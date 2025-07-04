
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Car, Bell, Menu, X, Shield, User, TrendingUp } from 'lucide-react';

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
    
    const salesTimer = setInterval(() => {
      setCarsSoldToday(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 120000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(salesTimer);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-sm border-b border-gray-100' 
        : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-primary">CarVibe</span>
              <span className="text-xs text-muted-foreground -mt-1 font-medium hidden sm:block">Good Vibes, Fair Deals</span>
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
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Stats */}
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                {carsSoldToday} cars sold today
              </Badge>

              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Shield className="h-3 w-3 mr-1" />
                Trusted Platform
              </Badge>
            </div>

            {/* Mobile Notification */}
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Desktop Profile */}
            <Link to="/profile" className="hidden md:flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Sign In</span>
            </Link>
            
            {/* Desktop Post Car Button */}
            <Link to="/sell">
              <Button size="sm" className="hidden md:inline-flex bg-primary hover:bg-primary/90 font-medium px-6 text-white">
                Post Your Car
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 bg-white">
            <nav className="flex flex-col space-y-4">
              {/* Mobile Stats */}
              <div className="flex flex-col space-y-2 pb-4 border-b border-border">
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 self-start">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {carsSoldToday} cars sold today
                </Badge>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 self-start">
                  <Shield className="h-3 w-3 mr-1" />
                  Trusted Platform
                </Badge>
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium transition-colors py-2 ${
                    isActive(item.path) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Actions */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <Link to="/profile" onClick={closeMobileMenu}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/sell" onClick={closeMobileMenu}>
                  <Button size="sm" className="w-full bg-primary font-semibold">
                    Post Your Car
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
