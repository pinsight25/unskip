
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import HeaderActions from './header/HeaderActions';
import HeaderCitySelector from './header/HeaderCitySelector';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [carsSoldToday, setCarsSoldToday] = useState(5);
  const { user } = useUser();
  const { data: unreadChats = 0 } = useQuery({
    queryKey: ['unreadChats', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('chats')
        .select('unread_count')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
      if (error) return 0;
      return (data || []).reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
    },
    enabled: !!user?.id,
    refetchInterval: 30000
  });
  const location = useLocation();

  const navItems = [
    { label: 'Buy Cars', path: '/' },
    { label: 'Sell', path: '/sell-car' },
    { label: 'Dealers', path: '/dealers' },
    { label: 'Accessories', path: '/accessories' }
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header Layout - Improved mobile spacing */}
        <div className="flex h-16 lg:h-20 items-center justify-between gap-2 sm:gap-4">
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation navItems={navItems} />

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
            {/* Desktop City Selector - Hidden on mobile */}
            <div className="hidden md:block">
              <HeaderCitySelector />
            </div>

            {/* Desktop Actions */}
            <HeaderActions carsSoldToday={carsSoldToday} unreadChats={unreadChats} />

            {/* Mobile Chat Icon with standardized badge positioning */}
            <Link
              to="/chats"
              className="lg:hidden relative p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              {unreadChats > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white z-10">
                  {unreadChats}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button - Always visible and prioritized */}
            <button
              className="lg:hidden p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
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
