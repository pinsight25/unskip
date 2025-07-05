
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageCircle, User, Shield } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-border py-4 bg-white">
      <nav className="flex flex-col space-y-4">
        {/* Mobile Stats */}
        <div className="flex flex-col space-y-2 pb-4 border-b border-border">
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 self-start">
            <TrendingUp className="h-3 w-3 mr-1" />
            {carsSoldToday} cars sold today
          </Badge>
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 self-start">
            <Shield className="h-3 w-3 mr-1" />
            Trusted Platform
          </Badge>
        </div>

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
          <Link to="/chats" onClick={onMenuClose}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              My Chats
              {unreadChats > 0 && (
                <Badge className="ml-auto bg-red-500 text-white text-xs">
                  {unreadChats}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/profile" onClick={onMenuClose}>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
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
