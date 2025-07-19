
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
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  car: any;
  otherUser: any;
  currentUser: any;
  chat: any;
  onReportChat: () => void;
  onBlockUser: () => void;
  onDeleteConversation: () => void;
  carImages?: any[];
  onBack: () => void;
}

const ChatHeader = ({ car, otherUser, currentUser, chat, onReportChat, onBlockUser, onDeleteConversation, carImages = [], onBack }: ChatHeaderProps) => {
  // Get cover image from carImages or fallback
  let carImageUrl = '/placeholder-car.jpg';
  if (Array.isArray(carImages) && carImages.length > 0) {
    const cover = carImages.find((img: any) => img.is_cover);
    carImageUrl = cover ? cover.image_url : carImages[0].image_url;
  }
  const isBuyer = currentUser?.id === chat?.buyer_id;
  // Show the other user's name and info in the header
  const headerTitle = isBuyer 
    ? `Chat with ${otherUser?.name || 'Seller'}`
    : `Chat with ${otherUser?.name || 'Buyer'}`;
  const headerSubtitle = isBuyer
    ? otherUser?.phone || ''
    : otherUser?.phone || '';
  // Robust car image fallback
  const carTitle = car ? `${car.year} ${car.brand} ${car.model}` : 'Car Details';
  const { toast } = useToast();
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 z-10">
      <div className="flex items-center gap-3 md:gap-4 px-2 md:px-4" style={{paddingTop:'env(safe-area-inset-top,20px)'}}>
        <button onClick={onBack} className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none" style={{minWidth:44, minHeight:44}}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img
          src={carImageUrl}
          alt={car?.make ? `${car.make} ${car.model}` : 'Car'}
          className="w-12 h-12 rounded-full object-cover border"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-car.jpg';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{carTitle}</h3>
          <p className="text-xs text-gray-900 truncate font-semibold">{headerTitle}</p>
          <p className="text-xs text-gray-600 truncate">{headerSubtitle}</p>
          <p className="text-xs text-gray-600 truncate">₹{car?.price?.toLocaleString() || 'Price not available'}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100" style={{minWidth:44, minHeight:44}}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => toast({ title: 'Report chat', description: 'Feature coming soon!' })} className="text-orange-600">
              <Flag className="h-4 w-4 mr-2" />
              Report this chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: 'Block user', description: 'Feature coming soon!' })} className="text-red-600">
              <Ban className="h-4 w-4 mr-2" />
              Block user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast({ title: 'Delete conversation', description: 'Feature coming soon!' })} className="text-red-600">
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
