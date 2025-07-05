
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
    <div className="flex items-center space-x-3">
      {/* Chat Icon - Desktop Only */}
      <Link to="/chats" className="hidden md:flex relative">
        <Button variant="ghost" size="sm" className="p-2 h-9 w-9 hover:bg-gray-100 rounded-lg">
          <MessageCircle className="h-5 w-5" />
          {unreadChats > 0 && (
            <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold border border-white">
              {unreadChats}
            </div>
          )}
        </Button>
      </Link>
      
      {/* Desktop Profile */}
      <Link to="/profile" className="hidden md:flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-100 text-gray-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">Sign In</span>
      </Link>
      
      {/* Post Car Button */}
      <Link to="/sell">
        <Button size="sm" className="hidden md:inline-flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-semibold px-4 h-9 text-white shadow-sm text-sm">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
