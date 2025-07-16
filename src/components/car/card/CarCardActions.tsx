
import { Button } from '@/components/ui/button';
import { MessageCircle, IndianRupee, Phone, Eye } from 'lucide-react';
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
          Connect with Seller
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
            className={`border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600 transition-all duration-200 ${!offerMade ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={!offerMade}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 ${!offerMade ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={!offerMade}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </div>
      )}
    </div>
  );
};

export default CarCardActions;
