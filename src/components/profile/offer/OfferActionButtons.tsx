
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';

interface OfferActionButtonsProps {
  status: 'pending' | 'accepted' | 'rejected';
  offerId: string;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  onChat: () => void;
  isMobile?: boolean;
}

const OfferActionButtons = ({ 
  status, 
  offerId, 
  onAccept, 
  onReject, 
  onChat, 
  isMobile = false 
}: OfferActionButtonsProps) => {
  if (status === 'pending') {
    return (
      <div className={`${isMobile ? 'flex flex-col md:flex-row gap-2' : 'space-y-2'}`}>
        <Button
          onClick={() => onAccept(offerId)}
          className={`${isMobile ? 'flex-1' : 'w-full'} bg-green-600 hover:bg-green-700 ${isMobile ? '' : 'text-sm'}`}
          size={isMobile ? 'default' : 'sm'}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {isMobile ? 'Accept Offer' : 'Accept'}
        </Button>
        <Button
          onClick={() => onReject(offerId)}
          variant="outline"
          className={`${isMobile ? 'flex-1' : 'w-full'} text-red-600 border-red-200 hover:bg-red-50 ${isMobile ? '' : 'text-sm'}`}
          size={isMobile ? 'default' : 'sm'}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <Button
        onClick={onChat}
        className={`${isMobile ? 'flex-1' : 'w-full'}`}
        size={isMobile ? 'default' : 'sm'}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        {isMobile ? 'Chat with Buyer' : 'Chat'}
      </Button>
    );
  }

  if (status === 'rejected') {
    return (
      <div className={`${isMobile ? 'flex-1 p-2' : ''} text-center text-gray-500 text-xs ${isMobile ? '' : 'p-2'}`}>
        {isMobile ? 'Offer rejected' : 'Offer rejected'}
      </div>
    );
  }

  return null;
};

export default OfferActionButtons;
