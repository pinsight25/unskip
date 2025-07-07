
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface CarCardActionsProps {
  onMakeOffer: () => void;
  onChat: () => void;
  offerMade: boolean;
}

const CarCardActions = ({ onMakeOffer, onChat, offerMade }: CarCardActionsProps) => {
  return (
    <div className="space-y-3 mt-4">
      <Button 
        size="sm"
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-semibold text-white h-10 text-sm shadow-sm"
        onClick={onMakeOffer}
      >
        Make an Offer
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 h-9 text-sm"
          onClick={onChat}
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          Chat
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 h-9 text-sm"
        >
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default CarCardActions;
