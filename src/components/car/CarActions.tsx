
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, MessageCircle, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOfferContext } from '@/contexts/OfferContext';

interface CarActionsProps {
  carId: string;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: () => void;
  onChatClick: () => void;
  onTestDrive: () => void;
}

const CarActions = ({ carId, offerStatus, onMakeOffer, onChatClick, onTestDrive }: CarActionsProps) => {
  const { toast } = useToast();
  const { hasOffered } = useOfferContext();

  const handleChatClick = () => {
    if (!hasOffered(carId)) {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    onChatClick();
  };

  const handleTestDriveClick = () => {
    if (!hasOffered(carId)) {
      toast({
        title: "Make an offer first",
        description: "Please make an offer before booking a test drive with the seller.",
        variant: "destructive",
      });
      return;
    }
    onTestDrive();
  };

  const getChatButtonConfig = () => {
    const offered = hasOffered(carId);
    switch (offerStatus) {
      case 'none':
        return {
          text: 'Chat',
          disabled: !offered,
          variant: 'outline' as const,
          className: offered ? 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600' : 'border-gray-300 text-gray-500'
        };
      case 'pending':
        return {
          text: 'Chat',
          disabled: !offered,
          variant: 'outline' as const,
          className: offered ? 'border-orange-300 text-orange-600' : 'border-gray-300 text-gray-500'
        };
      case 'accepted':
        return {
          text: 'Chat',
          disabled: false,
          variant: 'outline' as const,
          className: 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600'
        };
      case 'rejected':
        return {
          text: 'Chat',
          disabled: true,
          variant: 'outline' as const,
          className: 'border-red-300 text-red-600'
        };
      default:
        return {
          text: 'Chat',
          disabled: !offered,
          variant: 'outline' as const,
          className: offered ? 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600' : 'border-gray-300 text-gray-500'
        };
    }
  };

  const chatConfig = getChatButtonConfig();
  const offered = hasOffered(carId);

  return (
    <div className="space-y-3">
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
        onClick={onMakeOffer}
      >
        <IndianRupee className="h-4 w-4 mr-2" />
        {offerStatus === 'pending' ? 'Offer Sent' : offerStatus === 'accepted' ? 'Offer Accepted' : 'Make an Offer'}
      </Button>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant={chatConfig.variant}
          onClick={handleChatClick}
          disabled={chatConfig.disabled}
          className={`transition-all duration-200 ${chatConfig.className}`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {chatConfig.text}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleTestDriveClick}
          disabled={!offered}
          className={`transition-all duration-200 ${
            offered 
              ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500' 
              : 'border-gray-300 text-gray-500'
          }`}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Test Drive
        </Button>
      </div>
      
      {offerStatus === 'accepted' && (
        <div className="mt-2">
          <Badge className="bg-green-100 text-green-800 border-green-200 w-full justify-center">
            ✅ Ready to chat with seller
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CarActions;
