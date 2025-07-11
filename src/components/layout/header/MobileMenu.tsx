
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, LogOut, Heart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import HeaderCitySelector from './HeaderCitySelector';

interface NavItem {
  label: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  carsSoldToday: number;
  unreadChats: number;
  isActive: (path: string) => boolean;
  onMenuClose: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  navItems, 
  carsSoldToday, 
  unreadChats, 
  isActive, 
  onMenuClose 
}: MobileMenuProps) => {
  const { user, isSignedIn, isLoading, signOut } = useUser();

  const handleSignOut = () => {
    signOut();
    onMenuClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border py-4 bg-white">
      {/* Mobile City Selector - Moved from header */}
      <div className="px-4 py-2 mb-4 border-b border-border">
        <HeaderCitySelector />
      </div>

      {/* User Section */}
      {!isLoading && isSignedIn && user ? (
        <div className="flex items-center space-x-3 px-4 py-3 border-b border-border mb-4">
          <Avatar className="h-12 w-12 border border-gray-200">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{user.name || 'User'}</p>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-gray-500"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center space-x-3 px-4 py-3 border-b border-border mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : null}

      <nav className="flex flex-col space-y-4 px-4">
        {/* Mobile Nav Items */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-base font-medium transition-colors py-2 ${
              isActive(item.path) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
            }`}
            onClick={onMenuClose}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Saved with Heart Icon */}
        <Link
          to="/saved"
          className={`text-base font-medium transition-colors py-2 flex items-center ${
            isActive('/saved') ? 'text-primary' : 'text-foreground/80 hover:text-primary'
          }`}
          onClick={onMenuClose}
        >
          <Heart className={`h-5 w-5 mr-2 ${isActive('/saved') ? 'fill-primary' : ''}`} />
          Saved
        </Link>
        
        {/* Mobile Actions */}
        <div className="flex flex-col space-y-3 pt-4 border-t border-border">
          {!isLoading && isSignedIn ? (
            <Link to="/profile" onClick={onMenuClose}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
          ) : null}
          <Link to="/sell" onClick={onMenuClose}>
            <Button size="sm" className="w-full bg-primary font-semibold">
              Post Your Car
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
