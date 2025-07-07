
import { Button } from '@/components/ui/button';
import { MessageCircle, IndianRupee, Calendar } from 'lucide-react';

interface CarCardActionsProps {
  onMakeOffer: () => void;
  onChat: () => void;
  offerMade: boolean;
}

const CarCardActions = ({ onMakeOffer, onChat, offerMade }: CarCardActionsProps) => {
  return (
    <div className="space-y-3">
      <Button 
        size="sm"
        className="w-full"
        onClick={onMakeOffer}
      >
        <IndianRupee className="h-4 w-4 mr-1" />
        Make an Offer
      </Button>
      <div className="grid grid-cols-2 grid-gap">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onChat}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="hover:bg-green-500 hover:text-white hover:border-green-500"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default CarCardActions;
