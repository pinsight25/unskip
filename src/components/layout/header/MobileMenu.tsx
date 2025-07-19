
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, LogOut, Heart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
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
  const { user, isLoading, signOut } = useUser();
  const { openSignInModal } = useAuthModal();

  const handleSignOut = () => {
    signOut();
    onMenuClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-16 left-0 right-0 bottom-16 bg-white z-40 border-t border-border overflow-y-auto">
      <div className="h-full flex flex-col">
        {/* Location Selector */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center space-x-2 text-gray-700">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Chennai</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* User Section */}
        {!isLoading && user ? (
          <div className="flex items-center space-x-3 px-4 py-4 border-b border-border">
            <Avatar className="h-12 w-12 border border-gray-200">
              <AvatarFallback className="bg-orange-100 text-orange-600 text-sm">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user.name || 'User'}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
            <Link to="/profile" onClick={onMenuClose}>
              <div className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center space-x-3 px-4 py-4 border-b border-border">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ) : null}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-base font-medium transition-colors py-3 px-2 rounded-lg ${
                  isActive(item.path) ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
                onClick={onMenuClose}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Saved with Heart Icon */}
            <Link
              to="/saved"
              className={`block text-base font-medium transition-colors py-3 px-2 rounded-lg flex items-center ${
                isActive('/saved') ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
              }`}
              onClick={onMenuClose}
            >
              <Heart className={`h-5 w-5 mr-3 ${isActive('/saved') ? 'fill-orange-600' : ''}`} />
              Saved
            </Link>
          </div>
        </nav>
        
        {/* Action Buttons */}
        <div className="px-4 py-4 border-t border-border space-y-3">
          {!isLoading && user ? (
            <Link to="/profile" onClick={onMenuClose}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 text-white"
              onClick={() => {
                openSignInModal();
                onMenuClose();
              }}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
          <Link to="/sell" onClick={onMenuClose}>
            <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold">
              Post Your Car
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
