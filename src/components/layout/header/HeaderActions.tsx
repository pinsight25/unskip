
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell, MessageCircle, User } from 'lucide-react';

interface HeaderActionsProps {
  carsSoldToday: number;
  unreadChats: number;
}

const HeaderActions = ({ carsSoldToday, unreadChats }: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Chat Icon - Desktop Only */}
      <Link to="/chats" className="hidden lg:flex relative">
        <Button variant="ghost" size="sm" className="p-2 h-9 w-9 hover:bg-gray-100 rounded-lg">
          <MessageCircle className="h-5 w-5" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center font-bold text-[9px] border border-white">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Mobile Bell Notification - Fixed Badge Position */}
      <div className="lg:hidden relative">
        <Button variant="ghost" size="sm" className="p-2 h-9 w-9 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 bg-red-500 text-white h-3.5 w-3.5 rounded-full p-0 flex items-center justify-center font-bold text-[8px] border border-white">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Desktop Profile */}
      <Link to="/profile" className="hidden lg:flex items-center space-x-3 hover:opacity-80 transition-opacity">
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
        <Button size="sm" className="hidden lg:inline-flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-semibold px-4 h-9 text-white shadow-sm text-sm">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
