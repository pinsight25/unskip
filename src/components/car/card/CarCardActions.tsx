
import { Button } from '@/components/ui/button';
import { MessageCircle, IndianRupee, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CarCardActionsProps {
  onMakeOffer: () => void;
  onChat: () => void;
  offerMade: boolean;
  isOwner?: boolean;
  onViewOffers?: () => void;
}

const CarCardActions = ({ onMakeOffer, onChat, offerMade, isOwner, onViewOffers }: CarCardActionsProps) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      {!isOwner && (
        <Button 
          size="sm"
          className="w-full"
          onClick={onMakeOffer}
        >
          <IndianRupee className="h-4 w-4 mr-1" />
          Make an Offer
        </Button>
      )}
      {isOwner && (
        <Button
          size="sm"
          className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
          onClick={() => navigate('/profile?tab=received-offers')}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Offers
        </Button>
      )}
      {!isOwner && (
        <div className="grid grid-cols-2 grid-gap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onChat}
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Test Drive
          </Button>
        </div>
      )}
    </div>
  );
};

export default CarCardActions;
