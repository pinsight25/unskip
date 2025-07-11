
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical, Flag, Ban, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Car } from '@/types/car';

interface ChatHeaderProps {
  car: Car;
  onBack: () => void;
  onReportChat: () => void;
  onBlockUser: () => void;
  onDeleteConversation: () => void;
}

const ChatHeader = ({ 
  car, 
  onBack, 
  onReportChat, 
  onBlockUser, 
  onDeleteConversation 
}: ChatHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 z-10">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="w-10 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
          <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{car.title}</h3>
          <p className="text-xs text-gray-600 truncate">{car.seller.name}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onReportChat} className="text-orange-600">
              <Flag className="h-4 w-4 mr-2" />
              Report this chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBlockUser} className="text-red-600">
              <Ban className="h-4 w-4 mr-2" />
              Block user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDeleteConversation} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
