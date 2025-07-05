
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header Layout */}
        <div className="flex h-14 items-center justify-between">
          <Logo />

          {/* Desktop Navigation - Only visible on md+ screens */}
          <DesktopNavigation navItems={navItems} />

          <div className="flex items-center space-x-2">
            {/* Desktop Actions - Always rendered but conditionally shown */}
            <HeaderActions carsSoldToday={carsSoldToday} unreadChats={unreadChats} />

            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              className="md:hidden p-2 h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center touch-target"
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
