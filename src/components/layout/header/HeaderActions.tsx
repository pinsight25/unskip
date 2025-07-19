
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageCircle, User, LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAuthModal } from '@/contexts/AuthModalContext';

interface HeaderActionsProps {
  carsSoldToday: number;
  unreadChats: number;
}

const HeaderActions = ({ carsSoldToday, unreadChats }: HeaderActionsProps) => {
  const { user, isLoading, signOut } = useUser();
  const { openSignInModal } = useAuthModal();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // console.error('🔴 HeaderActions: Sign out failed:', error);
    }
  };

  return (
    <div className="hidden lg:flex items-center space-x-6">
      {/* Chat Icon with Badge */}
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
      {/* Profile/Sign In Section - FIXED LOGIC */}
      {isLoading ? (
        // Show loading state only when actually loading
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : user ? (
        // Show user profile when signed in AND user data is available
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : isLoading ? (
        <>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src="" />
              <AvatarFallback className="bg-orange-100 text-orange-600">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="body-text font-medium text-gray-700">Setting up...</span>
          </div>
        </>
      ) : (
        // Show sign in when not signed in
        <>
          <button 
            onClick={() => openSignInModal()}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gray-100 text-gray-600">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="body-text font-medium text-gray-700">Sign In</span>
          </button>
        </>
      )}
    </div>
  );
};

export default HeaderActions;
