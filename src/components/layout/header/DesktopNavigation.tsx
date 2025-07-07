
import { Link, useLocation } from 'react-router-dom';

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
      
      {/* Add Profile and Saved to desktop navigation */}
      <Link
        to="/profile"
        className={`text-base font-semibold transition-all duration-300 hover:text-primary relative py-2 ${
          isActive('/profile') ? 'text-primary' : 'text-foreground/80'
        }`}
      >
        Profile
        {isActive('/profile') && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
        )}
      </Link>
      
      <Link
        to="/saved"
        className={`text-base font-semibold transition-all duration-300 hover:text-primary relative py-2 ${
          isActive('/saved') ? 'text-primary' : 'text-foreground/80'
        }`}
      >
        Saved
        {isActive('/saved') && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
        )}
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
