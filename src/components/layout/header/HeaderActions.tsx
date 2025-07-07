
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User } from 'lucide-react';

interface HeaderActionsProps {
  carsSoldToday: number;
  unreadChats: number;
}

const HeaderActionsDesktop = ({ carsSoldToday, unreadChats }: HeaderActionsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* Chat Icon with improved badge positioning */}
      <Link to="/chats" className="relative">
        <Button variant="ghost" size="sm" className="p-2 h-10 w-10 hover:bg-gray-100 rounded-lg flex items-center justify-center">
          <MessageCircle className="h-5 w-5" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold leading-none border-2 border-white">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </Link>
      
      {/* Desktop Profile */}
      <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <Avatar className="h-9 w-9 border border-gray-200">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-100 text-gray-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">Sign In</span>
      </Link>
      
      {/* Post Car Button */}
      <Link to="/sell">
        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-semibold px-6 h-10 text-white shadow-sm text-sm">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActionsDesktop;
