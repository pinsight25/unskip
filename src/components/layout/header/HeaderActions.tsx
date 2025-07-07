
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, User } from 'lucide-react';

interface HeaderActionsProps {
  carsSoldToday: number;
  unreadChats: number;
}

const HeaderActions = ({ carsSoldToday, unreadChats }: HeaderActionsProps) => {
  return (
    <div className="hidden lg:flex items-center space-x-6">
      {/* Chat Icon with Badge */}
      <Link to="/chats" className="relative">
        <Button variant="ghost" size="sm" className="p-2 h-12 w-12 hover:bg-gray-100 rounded-lg flex items-center justify-center">
          <MessageCircle className="h-5 w-5" />
          {unreadChats > 0 && (
            <span className="notification-badge">
              {unreadChats}
            </span>
          )}
        </Button>
      </Link>
      
      {/* Desktop Profile */}
      <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <Avatar className="h-10 w-10 border border-gray-200">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-100 text-gray-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="body-text font-medium text-gray-700">Sign In</span>
      </Link>
      
      {/* Post Car Button - PRIMARY CTA */}
      <Link to="/sell">
        <Button size="default" className="font-semibold px-6 shadow-sm">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
