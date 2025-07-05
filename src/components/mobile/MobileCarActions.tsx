
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
        className="w-full btn-primary h-11 text-sm font-semibold"
      >
        Make an Offer
      </Button>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation();
            onChat();
          }}
          className="h-10 text-sm font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
          disabled={offerStatus === 'pending' || offerStatus === 'rejected'}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {getChatButtonText()}
        </Button>
        <Button 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation();
            onTestDrive();
          }}
          className="h-10 text-sm font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default MobileCarActions;
