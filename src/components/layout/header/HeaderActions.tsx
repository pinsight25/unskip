
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
    <div className="flex items-center space-x-2 lg:space-x-8">
      {/* Desktop Stats - Enhanced design */}
      <div className="hidden lg:flex items-center space-x-6">
        <Badge variant="secondary" className="bg-green-500/15 text-green-700 border-green-500/30 px-4 py-2.5 font-semibold text-base shadow-sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          {carsSoldToday} cars sold today
        </Badge>

        <Badge variant="secondary" className="bg-success/15 text-success border-success/30 px-4 py-2.5 font-semibold text-base shadow-sm">
          <Shield className="h-4 w-4 mr-2" />
          Trusted Platform
        </Badge>
      </div>

      {/* Chat Icon - Enhanced visibility */}
      <Link to="/chats" className="hidden lg:flex relative">
        <Button variant="ghost" size="sm" className="p-3 h-12 w-12 hover:bg-primary/10">
          <MessageCircle className="h-6 w-6" />
          {unreadChats > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-sm h-6 w-6 rounded-full p-0 flex items-center justify-center font-bold shadow-lg">
              {unreadChats}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Mobile Notification */}
      <Button variant="ghost" size="sm" className="lg:hidden p-2 h-10 w-10">
        <Bell className="h-5 w-5" />
      </Button>
      
      {/* Desktop Profile - Enhanced */}
      <Link to="/profile" className="hidden lg:flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <span className="text-base font-semibold">Sign In</span>
      </Link>
      
      {/* Post Car Button - More prominent */}
      <Link to="/sell">
        <Button size="lg" className="hidden lg:inline-flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold px-10 h-14 text-white shadow-xl hover:shadow-2xl transition-all text-lg">
          Post Your Car
        </Button>
      </Link>
    </div>
  );
};

export default HeaderActions;
