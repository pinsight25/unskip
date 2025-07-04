
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
    <div className="bg-white border-t border-gray-200 shadow-lg px-2 py-3 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 min-w-[60px] transition-all duration-300 relative ${
                item.active 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                {item.isPrimary ? (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${
                    item.active 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 scale-110 shadow-orange-200' 
                      : 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 hover:scale-105 shadow-orange-100'
                  } ring-4 ring-white ring-opacity-100`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                ) : (
                  <div className="p-2">
                    <Icon className={`h-6 w-6 transition-colors duration-200 ${
                      item.active ? 'text-primary' : 'text-gray-500'
                    }`} />
                  </div>
                )}
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0 border-2 border-white">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                item.active ? 'text-primary' : 'text-gray-500'
              } ${item.isPrimary ? 'text-white font-semibold' : ''}`}>
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
