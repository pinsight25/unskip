
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
      {/* Chat Icon with Badge - Fixed styling */}
      <Link to="/chats" className="relative">
        <div className="p-2 h-12 w-12 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors relative">
          <MessageCircle className="h-5 w-5 text-gray-700" />
          {unreadChats > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white z-10">
              {unreadChats}
            </span>
          )}
        </div>
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
