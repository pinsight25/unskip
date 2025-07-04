
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
    <div className="space-y-2">
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onMakeOffer();
        }}
        className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-11"
      >
        Make an Offer
      </Button>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          onClick={onChat}
          className="h-10 text-sm font-medium"
          disabled={offerStatus === 'pending' || offerStatus === 'rejected'}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {getChatButtonText()}
        </Button>
        <Button 
          variant="outline" 
          onClick={onTestDrive}
          className="h-10 text-sm font-medium"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default MobileCarActions;
