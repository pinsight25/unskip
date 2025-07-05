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
    <div className="flex items-center space-x-1 lg:space-x-6">
      {/* Desktop Stats - Better spacing */}
      <div className="hidden lg:flex items-center space-x-6">
        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1.5 font-medium">
          <TrendingUp className="h-3 w-3 mr-2" />
          {carsSoldToday} cars sold today
        </Badge>

        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-3 py-1.5 font-medium">
          <Shield className="h-3 w-3 mr-2" />
          Trusted Platform
        </Badge>
      </div>

      {/* Chat Icon - Desktop with better spacing */}
      <Link to="/chats" className="hidden lg:flex relative">
        <Button variant="ghost" size="sm" className="p-3 h-10 w-10">
          <MessageCircle className="h-5 w-5" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Mobile Notification - Keep existing */}
      <Button variant="ghost" size="sm" className="lg:hidden p-1.5 h-8 w-8">
        <Bell className="h-4 w-4" />
      </Button>
      
      {/* Desktop Profile - Better spacing */}
      <Link to="/profile" className="hidden lg:flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Sign In</span>
      </Link>
      
      {/* Desktop Post Car Button - Better styling */}
      <Link to="/sell">
        <Button size="lg" className="hidden lg:inline-flex bg-primary hover:bg-primary/90 font-semibold px-8 h-11 text-white shadow-md hover:shadow-lg transition-all">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
