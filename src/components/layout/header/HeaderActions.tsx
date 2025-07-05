
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell, TrendingUp, MessageCircle, User, Shield } from 'lucide-react';

interface HeaderActionsProps {
  carsSoldToday: number;
  unreadChats: number;
}

const HeaderActions = ({ carsSoldToday, unreadChats }: HeaderActionsProps) => {
  return (
    <div className="flex items-center space-x-1 lg:space-x-4">
      {/* Desktop Stats - Compact design */}
      <div className="hidden lg:flex items-center space-x-3">
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-2 py-1 text-xs font-medium">
          <TrendingUp className="h-3 w-3 mr-1" />
          {carsSoldToday} sold today
        </Badge>

        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-1 text-xs font-medium">
          <Shield className="h-3 w-3 mr-1" />
          Trusted
        </Badge>
      </div>

      {/* Chat Icon - Compact */}
      <Link to="/chats" className="hidden lg:flex relative">
        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 hover:bg-primary/10">
          <MessageCircle className="h-4 w-4" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center font-bold">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Mobile Notification */}
      <Button variant="ghost" size="sm" className="lg:hidden p-2 h-8 w-8">
        <Bell className="h-4 w-4" />
      </Button>
      
      {/* Desktop Profile - Compact */}
      <Link to="/profile" className="hidden lg:flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="h-8 w-8 border border-primary/20">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Sign In</span>
      </Link>
      
      {/* Post Car Button - Balanced prominence */}
      <Link to="/sell">
        <Button size="sm" className="hidden lg:inline-flex bg-primary hover:bg-primary/90 font-medium px-4 h-10 text-white shadow-sm">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
