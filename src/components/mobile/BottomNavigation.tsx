
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User } from 'lucide-react';

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
      <nav className="flex items-center justify-around h-14 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 py-2 min-h-[44px] relative"
            >
              <div className="relative mb-1">
                <Icon className={`h-5 w-5 ${
                  item.active ? 'text-orange-500' : 'text-gray-600'
                }`} />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold border border-white">
                    {item.badge}
                  </div>
                )}
              </div>
              <span className={`text-xs ${
                item.active ? 'text-orange-500 font-medium' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
