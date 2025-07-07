
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import SignInModal from '@/components/modals/SignInModal';

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
  const { user, isSignedIn, signOut } = useUser();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    onMenuClose();
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
    onMenuClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="md:hidden border-t border-border py-4 bg-white">
        {/* User Section */}
        {isSignedIn && user ? (
          <div className="flex items-center space-x-3 px-4 py-3 border-b border-border mb-4">
            <Avatar className="h-12 w-12 border border-gray-200">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user.name}</p>
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
        ) : null}

        <nav className="flex flex-col space-y-4">
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
          
          {/* Mobile Actions */}
          <div className="flex flex-col space-y-3 pt-4 border-t border-border">
            {!isSignedIn ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleSignInClick}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <Link to="/profile" onClick={onMenuClose}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            )}
            <Link to="/sell" onClick={onMenuClose}>
              <Button size="sm" className="w-full bg-primary font-semibold">
                Post Your Car
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
};

export default MobileMenu;
