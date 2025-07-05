
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BottomNavigation = () => {
  const location = useLocation();
  const [savedCount] = useState(3);

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: Search, label: 'Search', path: '/search', active: location.pathname === '/search' },
    { icon: Plus, label: 'Sell', path: '/sell', active: location.pathname === '/sell', isPrimary: true },
    { icon: Heart, label: 'Saved', path: '/saved', active: location.pathname === '/saved', badge: savedCount },
    { icon: User, label: 'Profile', path: '/profile', active: location.pathname === '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <nav className="flex items-center justify-around h-14 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center relative p-2 transition-all duration-200 active:scale-95 min-w-0 flex-1 ${
                item.isPrimary 
                  ? 'max-w-[64px]' 
                  : 'max-w-[72px]'
              } ${
                item.active && !item.isPrimary
                  ? 'text-orange-500' 
                  : 'text-gray-600'
              }`}
            >
              {item.isPrimary ? (
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                      : 'bg-gradient-to-r from-orange-400 to-red-400'
                  }`}>
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative mb-1">
                    <Icon className={`h-5 w-5 transition-all duration-200 ${
                      item.active ? 'text-orange-500' : 'text-gray-600'
                    }`} strokeWidth={item.active ? 2.5 : 2} />
                    {item.badge && item.badge > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-3 w-3 rounded-full flex items-center justify-center p-0 border border-white font-bold text-[8px]">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-all duration-200 leading-none ${
                    item.active ? 'text-orange-500' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white"></div>
    </div>
  );
};

export default BottomNavigation;
