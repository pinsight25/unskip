
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const getOfferButton = () => {
    switch (offerStatus) {
      case 'pending':
        return (
          <Button size="sm" variant="secondary" disabled className="flex-1">
            <Badge variant="secondary" className="mr-2 text-xs">Pending</Badge>
            Offer Sent
          </Button>
        );
      case 'accepted':
        return (
          <Button size="sm" variant="secondary" className="flex-1 bg-green-100 text-green-800">
            <Badge className="mr-2 text-xs bg-green-200 text-green-800">Accepted</Badge>
            Offer Accepted
          </Button>
        );
      case 'rejected':
        return (
          <Button size="sm" variant="outline" onClick={onMakeOffer} className="flex-1">
            Make New Offer
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={onMakeOffer} className="flex-1">
            Make an Offer
          </Button>
        );
    }
  };

  return (
    <div className="space-y-3 pb-4">
      {/* Primary Action */}
      <div className="flex gap-2">
        {getOfferButton()}
      </div>
      
      {/* Secondary Actions with improved spacing */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="default"
          onClick={onChat}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onTestDrive}
          className="flex-1"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default MobileCarActions;
