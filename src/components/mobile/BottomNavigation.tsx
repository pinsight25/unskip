
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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white border-t border-gray-200 shadow-lg px-2 py-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 min-w-[60px] transition-colors duration-200 relative ${
                  item.active 
                    ? 'text-primary' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  {item.isPrimary ? (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                      item.active ? 'bg-primary scale-110' : 'bg-primary/90 hover:bg-primary'
                    }`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  ) : (
                    <div className="p-2">
                      <Icon className={`h-6 w-6 ${item.active ? 'text-primary' : ''}`} />
                    </div>
                  )}
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0 border-2 border-white">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  item.active ? 'text-primary' : 'text-gray-500'
                } ${item.isPrimary ? 'mt-0' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
