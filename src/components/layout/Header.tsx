
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          <Logo />

          <DesktopNavigation navItems={navItems} />

          <div className="flex items-center space-x-1 md:space-x-4">
            <HeaderActions carsSoldToday={carsSoldToday} unreadChats={unreadChats} />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1.5 h-8 w-8 rounded-lg hover:bg-secondary/50 transition-colors flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
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
