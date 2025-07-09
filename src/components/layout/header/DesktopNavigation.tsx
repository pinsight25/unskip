
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
}

interface DesktopNavigationProps {
  navItems: NavItem[];
}

const DesktopNavigation = ({ navItems }: DesktopNavigationProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-base font-semibold transition-all duration-300 hover:text-primary relative py-2 ${
            isActive(item.path) ? 'text-primary' : 'text-foreground/80'
          }`}
        >
          {item.label}
          {isActive(item.path) && (
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
          )}
        </Link>
      ))}
      
      {/* Saved with Heart Icon */}
      <Link
        to="/saved"
        className={`text-base font-semibold transition-all duration-300 hover:text-primary relative py-2 flex items-center ${
          isActive('/saved') ? 'text-primary' : 'text-foreground/80'
        }`}
      >
        <Heart className={`h-5 w-5 ${isActive('/saved') ? 'fill-primary' : ''}`} />
        {isActive('/saved') && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
        )}
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
