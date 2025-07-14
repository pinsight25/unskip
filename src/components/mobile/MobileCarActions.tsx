
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Calendar, IndianRupee, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOfferContext } from '@/contexts/OfferContext';
import { useNavigate } from 'react-router-dom';

interface MobileCarActionsProps {
  carId: string;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: (e?: React.MouseEvent) => void;
  onChat: (e?: React.MouseEvent) => void;
  onTestDrive: (e?: React.MouseEvent) => void;
  isOwner?: boolean;
  onViewOffers?: () => void;
}

const MobileCarActions = ({
  carId,
  offerStatus,
  onMakeOffer,
  onChat,
  onTestDrive,
  isOwner,
  onViewOffers
}: MobileCarActionsProps) => {
  const { toast } = useToast();
  const { hasOffered } = useOfferContext();
  const navigate = useNavigate();

  const handleChatClick = (e?: React.MouseEvent) => {
    if (!hasOffered(carId)) {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    onChat(e);
  };

  const handleTestDriveClick = (e?: React.MouseEvent) => {
    if (!hasOffered(carId)) {
      toast({
        title: "Make an offer first",
        description: "Please make an offer before booking a test drive with the seller.",
        variant: "destructive",
      });
      return;
    }
    onTestDrive(e);
  };

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

  const offered = hasOffered(carId);

  return (
    <div className="space-y-3 pb-4">
      {/* Primary Action */}
      <div className="flex gap-2">
        {!isOwner && getOfferButton()}
        {isOwner && (
          <Button
            size="sm"
            className="flex-1 bg-cyan-600 text-white hover:bg-cyan-700"
            onClick={() => navigate('/profile?tab=received-offers')}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Offers
          </Button>
        )}
      </div>
      {/* Secondary Actions with consistent styling */}
      {!isOwner && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleChatClick}
            disabled={!offered}
            className={`flex-1 ${
              offered 
                ? 'border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white hover:border-orange-600'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleTestDriveClick}
            disabled={!offered}
            className={`flex-1 ${
              offered
                ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Test Drive
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileCarActions;
