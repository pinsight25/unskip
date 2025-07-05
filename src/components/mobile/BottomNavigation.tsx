
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
    <div className="px-6 py-4 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-4 min-w-[70px] min-h-[60px] transition-all duration-300 relative rounded-2xl ${
                item.active && !item.isPrimary
                  ? 'text-primary bg-primary/10 transform scale-110' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                {item.isPrimary ? (
                  <div className={`w-18 h-18 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 transform ${
                    item.active 
                      ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 scale-125 shadow-orange-400' 
                      : 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 hover:from-orange-500 hover:via-red-500 hover:to-pink-500 hover:scale-115 shadow-orange-300'
                  } ring-4 ring-white/90 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    <Icon className="h-10 w-10 text-white relative z-10" />
                  </div>
                ) : (
                  <div className="p-2 relative">
                    <Icon className={`h-7 w-7 transition-all duration-300 ${
                      item.active ? 'text-primary scale-125' : 'text-gray-500'
                    }`} />
                    {item.active && !item.isPrimary && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                )}
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-6 w-6 rounded-full flex items-center justify-center p-0 border-2 border-white shadow-sm font-bold">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-sm mt-2 font-semibold transition-all duration-300 ${
                item.active && !item.isPrimary ? 'text-primary font-bold' : 'text-gray-500'
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
