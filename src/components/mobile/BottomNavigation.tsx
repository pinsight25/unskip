
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
    <div className="px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 min-w-[60px] transition-all duration-300 relative rounded-xl ${
                item.active && !item.isPrimary
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                {item.isPrimary ? (
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform ${
                    item.active 
                      ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 scale-110 shadow-orange-300' 
                      : 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 hover:scale-105 shadow-orange-200'
                  } ring-4 ring-white/80 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    <Icon className="h-8 w-8 text-white relative z-10" />
                  </div>
                ) : (
                  <div className="p-2 relative">
                    <Icon className={`h-6 w-6 transition-all duration-300 ${
                      item.active ? 'text-primary scale-110' : 'text-gray-500'
                    }`} />
                    {item.active && !item.isPrimary && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </div>
                )}
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0 border-2 border-white shadow-sm">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                item.active && !item.isPrimary ? 'text-primary font-semibold' : 'text-gray-500'
              } ${item.isPrimary ? 'text-white font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
