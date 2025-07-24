
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { useSavedCars } from '@/hooks/useSavedCars';
import { useUser } from '@/contexts/UserContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useUser();
  const { savedCars } = useSavedCars();
  const savedCount = user && savedCars ? savedCars.length : 0;

  let navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: Search, label: 'Search', path: '/search', active: location.pathname === '/search' },
    { icon: Heart, label: 'Saved', path: '/saved', active: location.pathname === '/saved', badge: savedCount },
    { icon: User, label: 'Profile', path: '/profile', active: location.pathname === '/profile' }
  ];

  if (user?.userType === 'dealer') {
    navItems.splice(2, 0, { icon: Plus, label: 'Dealer Dashboard', path: '/dealer/dashboard', active: location.pathname.startsWith('/dealer') });
  } else {
    navItems.splice(2, 0, { icon: Plus, label: 'Sell', path: '/sell-car', active: location.pathname === '/sell-car' || location.pathname === '/sell' });
  }

  const handleNavClick = () => {
    window.dispatchEvent(new Event('closeMobileMenu'));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Modern Navigation Bar with rounded top corners */}
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50 rounded-t-3xl shadow-2xl">
        <nav className="flex items-center justify-around h-16 px-2 max-w-md mx-auto relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isCenter = index === 2; // Sell button is in the center
            
            if (isCenter) {
              // Enhanced Floating Action Button for Sell with orange brand colors
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 z-10"
                  onClick={handleNavClick}
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ring-4 ring-orange-100">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-30 blur-lg animate-pulse"></div>
                  </div>
                  <span className="absolute top-16 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 py-3 min-h-[44px] relative group"
                onClick={handleNavClick}
              >
                {/* Active state background */}
                {item.active && (
                  <div className="absolute inset-x-2 inset-y-1 bg-orange-50 rounded-2xl transition-all duration-200"></div>
                )}
                
                <div className="relative mb-1 z-10">
                  <Icon className={`h-5 w-5 transition-colors duration-200 ${
                    item.active 
                      ? 'text-orange-500' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  {item.label === 'Saved' && savedCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                      {savedCount}
                    </div>
                  )}
                </div>
                
                <span className={`text-xs font-medium transition-colors duration-200 z-10 ${
                  item.active 
                    ? 'text-orange-500' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNavigation;
