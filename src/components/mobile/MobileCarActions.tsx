
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, IndianRupee, Phone, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOfferContext } from '@/contexts/OfferContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

interface MobileCarActionsProps {
  carId: string;
  sellerId: string;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  offerAmount: number | null;
  onMakeOffer: (e?: React.MouseEvent) => void;
  onChat: (e?: React.MouseEvent) => void;
  onTestDrive: (e?: React.MouseEvent) => void;
  isOwner?: boolean;
  onViewOffers?: () => void;
  sellerPhone?: string; // <-- Add sellerPhone prop
}

const MobileCarActions = ({
  carId,
  sellerId,
  offerStatus,
  offerAmount,
  onMakeOffer,
  onChat,
  onTestDrive,
  isOwner,
  onViewOffers,
  sellerPhone
}: MobileCarActionsProps) => {
  const { toast } = useToast();
  const { hasOffered } = useOfferContext();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleChatClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (offerStatus !== 'accepted') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    try {
      // Check for existing chat
      const { data: chat } = await supabase
        .from('chats')
        .select('id')
        .eq('car_id', carId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();
      if (chat) {
        navigate(`/chats/${chat.id}`);
      } else {
        // Create new chat
        const { data: newChat } = await supabase
          .from('chats')
          .insert({
            car_id: carId,
            buyer_id: user.id,
            seller_id: sellerId,
            status: 'active'
          })
          .select('id')
          .single();
        if (newChat) {
          navigate(`/chats/${newChat.id}`);
        }
      }
    } catch (error) {
      toast({ title: 'Failed to open chat', variant: 'destructive' });
    }
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

  // Add call handler
  const handleCall = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sellerPhone) {
      window.location.href = `tel:${sellerPhone}`;
    }
  };

  const getOfferButton = () => {
    switch (offerStatus) {
      case 'pending':
        return (
          <Button size="sm" variant="secondary" disabled className="flex-1">
            <Badge variant="secondary" className="mr-2 text-xs">Pending</Badge>
            Offer Sent{offerAmount ? `: ₹${offerAmount}` : ''}
          </Button>
        );
      case 'accepted':
        return (
          <Button size="sm" variant="secondary" className="flex-1 bg-green-100 text-green-800" disabled>
            <Badge className="mr-2 text-xs bg-green-200 text-green-800">Accepted</Badge>
            Offer Accepted ✓
          </Button>
        );
      case 'rejected':
        return (
          <Button size="sm" variant="outline" onClick={onMakeOffer} className="flex-1">
            <IndianRupee className="h-4 w-4 mr-1" />
            Connect with Seller
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={onMakeOffer} className="flex-1">
            <IndianRupee className="h-4 w-4 mr-1" />
            Connect with Seller
          </Button>
        );
    }
  };

  const offered = hasOffered(carId);

  return (
    <div className="space-y-3 pb-4">
      {/* Primary Action */}
      <div className="flex gap-2">
        {!isOwner && (
          offerStatus === 'accepted' ? (
            <Button
              size="sm"
              className="flex-1 bg-green-100 text-green-700 border border-green-500 font-semibold"
              variant="secondary"
              disabled
            >
              <Badge className="mr-2 text-xs bg-green-200 text-green-800">Accepted</Badge>
              Offer Accepted ✓
            </Button>
          ) : getOfferButton()
        )}
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
            disabled={offerStatus !== 'accepted'}
            className={`flex-1 ${
              offerStatus === 'accepted'
                ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500'
                : 'border-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCall}
            disabled={offerStatus !== 'accepted' || !sellerPhone}
            className={`flex-1 ${
              offerStatus === 'accepted' && sellerPhone
                ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500'
                : 'border-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
            }`}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileCarActions;
