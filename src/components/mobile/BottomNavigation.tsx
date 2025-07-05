
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center relative p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                item.isPrimary 
                  ? 'flex-none' 
                  : 'flex-1 max-w-[80px]'
              } ${
                item.active && !item.isPrimary
                  ? 'text-orange-500' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {item.isPrimary ? (
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform ${
                    item.active 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 scale-105' 
                      : 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 hover:scale-105'
                  }`}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative mb-1">
                    <Icon className={`h-5 w-5 transition-all duration-200 ${
                      item.active ? 'text-orange-500 scale-110' : 'text-gray-600'
                    }`} strokeWidth={item.active ? 2.5 : 2} />
                    {item.badge && item.badge > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-4 w-4 rounded-full flex items-center justify-center p-0 border border-white shadow-sm font-bold text-[9px]">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-all duration-200 ${
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
    </div>
  );
};

export default BottomNavigation;
