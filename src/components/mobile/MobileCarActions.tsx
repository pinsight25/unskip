
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar } from 'lucide-react';

interface MobileCarActionsProps {
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: () => void;
  onChat: () => void;
  onTestDrive: () => void;
}

const MobileCarActions = ({ 
  offerStatus, 
  onMakeOffer, 
  onChat, 
  onTestDrive 
}: MobileCarActionsProps) => {
  const getChatButtonText = () => {
    switch (offerStatus) {
      case 'none':
        return 'Chat';
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Chat';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Chat';
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onMakeOffer();
        }}
        className="w-full"
      >
        Make an Offer
      </Button>
      
      <div className="grid grid-cols-2 grid-gap">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onChat();
          }}
          disabled={offerStatus === 'pending' || offerStatus === 'rejected'}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {getChatButtonText()}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onTestDrive();
          }}
          className="hover:bg-green-500 hover:text-white hover:border-green-500"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default MobileCarActions;
