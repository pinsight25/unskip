
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockChats } from '@/data/chatMockData';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import HeaderActions from './header/HeaderActions';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [carsSoldToday, setCarsSoldToday] = useState(5);
  const [unreadChats, setUnreadChats] = useState(0);
  const location = useLocation();

  const navItems = [
    { label: 'Buy Cars', path: '/' },
    { label: 'Sell', path: '/sell' },
    { label: 'Dealers', path: '/dealers' },
    { label: 'Accessories', path: '/accessories' },
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

    // Calculate unread chats
    const totalUnread = mockChats.reduce((sum, chat) => sum + chat.unreadCount, 0);
    setUnreadChats(totalUnread);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(salesTimer);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 lg:fixed lg:top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header Layout */}
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop Navigation - Only visible on md+ screens */}
          <DesktopNavigation navItems={navItems} />

          <div className="flex items-center space-x-3">
            {/* Desktop Actions - Always rendered but conditionally shown */}
            <HeaderActions carsSoldToday={carsSoldToday} unreadChats={unreadChats} />

            {/* Mobile Chat Icon - Only visible on mobile with improved badge positioning */}
            <Link
              to="/chats"
              className="md:hidden p-2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center touch-target relative"
            >
              <MessageCircle className="h-5 w-5 text-gray-700" />
              {unreadChats > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold border-2 border-white shadow-sm leading-none">
                  {unreadChats}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              className="md:hidden p-2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          navItems={navItems}
          carsSoldToday={carsSoldToday}
          unreadChats={unreadChats}
          isActive={isActive}
          onMenuClose={closeMobileMenu}
        />
      </div>
    </header>
  );
};

export default Header;
