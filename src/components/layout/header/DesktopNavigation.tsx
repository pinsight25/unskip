
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
          className={`text-sm font-medium transition-all duration-300 hover:text-primary relative ${
            isActive(item.path) ? 'text-primary' : 'text-foreground/80'
          }`}
        >
          {item.label}
          {isActive(item.path) && (
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNavigation;
