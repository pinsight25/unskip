
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Calendar, IndianRupee } from 'lucide-react';

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
            <IndianRupee className="h-4 w-4 mr-1" />
            Make New Offer
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={onMakeOffer} className="flex-1">
            <IndianRupee className="h-4 w-4 mr-1" />
            Make an Offer
          </Button>
        );
    }
  };

  const getChatButtonConfig = () => {
    const isDisabled = offerStatus === 'none' || offerStatus === 'pending' || offerStatus === 'rejected';
    return {
      disabled: isDisabled,
      className: isDisabled 
        ? 'border-gray-300 text-gray-500' 
        : 'border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white hover:border-orange-600'
    };
  };

  const chatConfig = getChatButtonConfig();

  return (
    <div className="space-y-3 pb-4">
      {/* Primary Action */}
      <div className="flex gap-2">
        {getOfferButton()}
      </div>
      
      {/* Secondary Actions with consistent styling */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={onChat}
          disabled={chatConfig.disabled}
          className={`flex-1 ${chatConfig.className}`}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onTestDrive}
          className="flex-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Test Drive
        </Button>
      </div>
    </div>
  );
};

export default MobileCarActions;
