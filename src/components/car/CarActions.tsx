
import { Button } from '@/components/ui/button';
import { DollarSign, MessageCircle, CalendarDays } from 'lucide-react';

interface CarActionsProps {
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: () => void;
  onChatClick: () => void;
  onTestDrive: () => void;
}

const CarActions = ({ offerStatus, onMakeOffer, onChatClick, onTestDrive }: CarActionsProps) => {
  const getChatButtonText = () => {
    switch (offerStatus) {
      case 'none':
        return 'Make offer to chat';
      case 'pending':
        return 'Waiting for response';
      case 'accepted':
        return 'Chat with seller';
      case 'rejected':
        return 'Offer rejected';
      default:
        return 'Chat';
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
        onClick={onMakeOffer}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        Make an Offer
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline"
          onClick={onChatClick}
          disabled={offerStatus === 'pending' || offerStatus === 'rejected'}
          className="border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-200"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {getChatButtonText()}
        </Button>
        <Button 
          variant="outline"
          onClick={onTestDrive}
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default CarActions;
