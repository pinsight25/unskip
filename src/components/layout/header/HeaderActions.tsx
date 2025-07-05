
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
    <div className="flex items-center space-x-1 md:space-x-4">
      {/* Desktop Stats */}
      <div className="hidden md:flex items-center space-x-4">
        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
          <TrendingUp className="h-3 w-3 mr-1" />
          {carsSoldToday} cars sold today
        </Badge>

        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <Shield className="h-3 w-3 mr-1" />
          Trusted Platform
        </Badge>
      </div>

      {/* Chat Icon - Desktop */}
      <Link to="/chats" className="hidden md:flex relative">
        <Button variant="ghost" size="sm" className="p-2">
          <MessageCircle className="h-5 w-5" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Mobile Notification - Fixed spacing */}
      <Button variant="ghost" size="sm" className="md:hidden p-1.5 h-8 w-8">
        <Bell className="h-4 w-4" />
      </Button>
      
      {/* Desktop Profile */}
      <Link to="/profile" className="hidden md:flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="h-9 w-9 border-2 border-primary/20">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Sign In</span>
      </Link>
      
      {/* Desktop Post Car Button */}
      <Link to="/sell">
        <Button size="sm" className="hidden md:inline-flex bg-primary hover:bg-primary/90 font-medium px-6 text-white">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
